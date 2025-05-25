package com.hmach.codiseum.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.TextNode;
import org.springframework.stereotype.Component;

@Component
public class HtmlComparator {

    private static final int MAX_TOTAL_SCORE = 50;
    private static final int MAX_SCORE_PER_NODE = 5;
    private static final int SCORE_TAG_MATCH = 2;

    private int compareNodes(Node official, Node player) {
        if (official == null && player == null) {
            return MAX_SCORE_PER_NODE;
        }
        if (official == null || player == null) {
            return 0;
        }

        if (!official.nodeName().equals(player.nodeName())) {
            return 0;
        }

        boolean isBody = official.nodeName().equals("body");
        int score = 0;

        if (official instanceof Element && player instanceof Element) {
            Element officialElem = (Element) official;
            Element playerElem = (Element) player;

            if (!isBody) {
                score += SCORE_TAG_MATCH;
            }

            int childrenCount = Math.min(officialElem.childNodeSize(), playerElem.childNodeSize());
            int childrenScore = 0;

            for (int i = 0; i < childrenCount; i++) {
                childrenScore += compareNodes(officialElem.childNode(i), playerElem.childNode(i));
            }

            if (childrenCount > 0) {
                childrenScore = childrenScore / childrenCount;
            }

            score += childrenScore;

        } else if (official instanceof TextNode && player instanceof TextNode) {
            TextNode officialText = (TextNode) official;
            TextNode playerText = (TextNode) player;

            String oText = officialText.text().trim();
            String pText = playerText.text().trim();

            if (oText.isEmpty() && pText.isEmpty()) {
                score += MAX_SCORE_PER_NODE;
            } else if (oText.equals(pText)) {
                score += MAX_SCORE_PER_NODE;
            } else {
                double similarity = levenshteinSimilarity(oText, pText);
                int simScore = (int) (similarity * MAX_SCORE_PER_NODE);
                score += simScore;
            }
        }

        return score;
    }

    // Calcula la similitud usando distancia de Levenshtein normalizada entre 0 y 1
    private double levenshteinSimilarity(String s1, String s2) {
        int distance = levenshteinDistance(s1, s2);
        int maxLen = Math.max(s1.length(), s2.length());
        if (maxLen == 0)
            return 1.0; // ambos vacíos
        double similarity = 1.0 - ((double) distance / maxLen);
        return similarity;
    }

    // Implementación clásica de distancia Levenshtein
    private int levenshteinDistance(String s1, String s2) {
        int[] costs = new int[s2.length() + 1];
        for (int j = 0; j < costs.length; j++) {
            costs[j] = j;
        }
        for (int i = 1; i <= s1.length(); i++) {
            costs[0] = i;
            int nw = i - 1;
            for (int j = 1; j <= s2.length(); j++) {
                int cj = Math.min(1 + Math.min(costs[j], costs[j - 1]),
                        s1.charAt(i - 1) == s2.charAt(j - 1) ? nw : nw + 1);
                nw = costs[j];
                costs[j] = cj;
            }
        }
        return costs[s2.length()];
    }

    public int calculateScore(String officialHtml, String playerHtml) {
        Document officialDoc = Jsoup.parse(officialHtml);
        Document playerDoc = Jsoup.parse(playerHtml);

        Element officialBody = officialDoc.body();
        Element playerBody = playerDoc.body();

        if (officialBody == null || playerBody == null) {
            return 0;
        }

        // Validar que la raíz del documento sea <html>
        if (!playerDoc.children().first().nodeName().equals("html")) {
            return 0;
        }

        Element htmlPlayer = playerDoc.child(0); // <html>

        for (Node sibling : htmlPlayer.childNodes()) {
            if (sibling instanceof Element) {
                Element el = (Element) sibling;
                // Permitimos sólo <head> y <body>
                if (!el.tagName().equals("head") && !el.tagName().equals("body")) {
                    return 0;
                }
            } else if (sibling instanceof TextNode) {
                TextNode tn = (TextNode) sibling;
                if (!tn.isBlank()) {
                    return 0;
                }
            }
        }

        int score = compareNodes(officialBody, playerBody);

        if (score > MAX_TOTAL_SCORE)
            score = MAX_TOTAL_SCORE;

        return score;
    }
}