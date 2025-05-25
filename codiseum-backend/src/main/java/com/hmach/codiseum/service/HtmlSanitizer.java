package com.hmach.codiseum.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class HtmlSanitizer {

    // Etiquetas que deben eliminarse SIEMPRE por razones de seguridad
    private static final List<String> DANGEROUS_TAGS = List.of(
            "script", "style", "iframe", "object", "embed",
            "link", "meta", "base", "form", "input", "textarea",
            "button", "select", "option", "frameset", "frame",
            "applet", "basefont", "bgsound", "blink", "marquee");

    public String sanitize(String html, List<String> allowedTags) {
        Document doc = Jsoup.parseBodyFragment(html);
        Element body = doc.body();

        Set<String> allowed = new HashSet<>();
        for (String tag : allowedTags) {
            allowed.add(tag.toLowerCase());
        }

        // Eliminar completamente (etiqueta + contenido) las etiquetas peligrosas dentro
        // del body
        for (String dangerousTag : DANGEROUS_TAGS) {
            Elements dangerElements = body.select(dangerousTag);
            dangerElements.remove(); // Elimina la etiqueta y todo su contenido
        }

        // Eliminar etiquetas no permitidas, pero conservar su contenido
        Elements allElements = body.getAllElements();
        for (int i = allElements.size() - 1; i >= 0; i--) {
            Element element = allElements.get(i);
            String tagName = element.tagName().toLowerCase();

            // Saltar root, document y body para no tocarlos
            if (tagName.equals("#root") || tagName.equals("#document") || tagName.equals("body"))
                continue;

            if (!allowed.contains(tagName)) {
                element.unwrap();
            }
        }

        String sanitizedHtml = body.html();
        sanitizedHtml = sanitizedHtml.replaceAll("\\s+", " ").trim();

        return sanitizedHtml;
    }
}