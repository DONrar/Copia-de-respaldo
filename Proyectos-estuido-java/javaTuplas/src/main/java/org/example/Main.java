package org.example;

import org.apache.commons.lang3.tuple.Pair;

public class Main {
    public static void main(String[] args) {

        Task task = new Task();
        Pair<String, Integer> pair = task.returningPair();
        System.out.println(task.returningString());
        System.out.println(pair.getLeft());
    }
}