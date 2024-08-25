package com.lec.spring.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/news")
public class NaverNewsController {

    @Value("${naver.api.client-id}")
    private String clientId; //애플리케이션 클라이언트 아이디

    @Value("${naver.api.client-secret}")
    private String clientSecret; //애플리케이션 클라이언트 시크릿

    @GetMapping("/api")
    @CrossOrigin
    public ResponseEntity<String> apiTest(@RequestParam(value = "query", required = false) String query,
                                          @RequestParam(value = "category", required= false) String category,
                                          @RequestParam(value = "display", defaultValue = "100") int display,
                                          @RequestParam(value = "start", defaultValue = "1") int start,
                                          @RequestParam(value = "sort", defaultValue = "date") String sort) {

        if (query == null || category != null){
            switch (category.toLowerCase()){
                case "entertainment":
                    query = "연예";
                    break;
                case "stock":
                    query = "주식";
                    break;
                case "technology":
                    query = "과학";
                    break;
                case "economy":
                    query = "경제";
                    break;
                case "politics":
                    query = "정치";
                    break;
                case "society":
                    query = "사회";
                    break;
                case "world":
                    query = "세계";
                    break;
                case "sports":
                    query = "스포츠";
                    break;
                case "weather":
                    query = "날씨";
                    break;
            }
        }

        String text = query;

        try {
            text = URLEncoder.encode(text, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("검색어 인코딩 실패", e);
        }

        String apiURL = String.format("https://openapi.naver.com/v1/search/news.json?query=%s&display=%d&start=%d&sort=%s",
                text, display, start, sort);      // JSON 결과

        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("X-Naver-Client-Id", clientId);
        requestHeaders.put("X-Naver-Client-Secret", clientSecret);
        String responseBody = get(apiURL, requestHeaders);

//        System.out.println(responseBody);

        return ResponseEntity.ok(responseBody); // 응답을 클라이언트로 반환
    }

    private static String get(String apiUrl, Map<String, String> requestHeaders){
        HttpURLConnection con = connect(apiUrl);
        try {
            con.setRequestMethod("GET");
            for(Map.Entry<String, String> header :requestHeaders.entrySet()) {
                con.setRequestProperty(header.getKey(), header.getValue());
            }

            int responseCode = con.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) { // 정상 호출
                return readBody(con.getInputStream());
            } else { // 오류 발생
                return readBody(con.getErrorStream());
            }
        } catch (IOException e) {
            throw new RuntimeException("API 요청과 응답 실패", e);
        } finally {
            con.disconnect();
        }
    }

    private static HttpURLConnection connect(String apiUrl){
        try {
            URL url = new URL(apiUrl);
            return (HttpURLConnection)url.openConnection();
        } catch (MalformedURLException e) {
            throw new RuntimeException("API URL이 잘못되었습니다. : " + apiUrl, e);
        } catch (IOException e) {
            throw new RuntimeException("연결이 실패했습니다. : " + apiUrl, e);
        }
    }

    private static String readBody(InputStream body){
        InputStreamReader streamReader = new InputStreamReader(body);

        try (BufferedReader lineReader = new BufferedReader(streamReader)) {
            StringBuilder responseBody = new StringBuilder();

            String line;
            while ((line = lineReader.readLine()) != null) {
                responseBody.append(line);
            }

            return responseBody.toString();
        } catch (IOException e) {
            throw new RuntimeException("API 응답을 읽는 데 실패했습니다.", e);
        }
    }
}
