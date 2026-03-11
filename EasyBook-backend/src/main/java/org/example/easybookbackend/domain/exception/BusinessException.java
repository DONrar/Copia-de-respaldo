package org.example.easybookbackend.domain.exception;

public class BusinessException extends RuntimeException {
    public BusinessException(String msg) { super(msg); }
}