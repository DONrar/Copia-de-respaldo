package org.example.easybookbackend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.easybookbackend.domain.entity.User;
import org.example.easybookbackend.repository.UserRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // NO excluyas /auth/me — solo login y endpoints realmente públicos
        return pathMatcher.match("/auth/login", path)
                || pathMatcher.match("/actuator/health", path)
                || pathMatcher.match("/v3/api-docs/**", path)
                || pathMatcher.match("/swagger-ui/**", path);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String header = request.getHeader(HttpHeaders.AUTHORIZATION);

            if (header != null && header.startsWith("Bearer ")) {
                String token = header.substring(7);

                if (jwtService.isTokenValid(token)) {
                    String email = jwtService.extractUsername(token);
                    Optional<User> userOpt = userRepository.findByEmail(email);

                    if (userOpt.isPresent() && userOpt.get().isEnabled()) {
                        User user = userOpt.get();
                        var auth = new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                        );
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            }
        } catch (Exception ex) {
            // Limpia el contexto ante cualquier problema de token
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}