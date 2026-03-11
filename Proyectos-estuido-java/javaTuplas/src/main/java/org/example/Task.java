package org.example;

import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.lang3.tuple.Triple;
public class Task {

    // String
    public String returningString(){
        return "Hello World";
    }

    // Number
    public Integer returningNumber(){
        return 10;
    }

    // Returning two params - Pair
    public Pair<String, Integer> returningPair(){
        return Pair.ofNonNull("Hello World", 10);
    }

    // Returning three params - Triple
    public Triple<String, Integer, Boolean> returningTriple(){
        return Triple.of("Hello World", 10, true);
    }
}
