package edu.ucsb.cs156.organic.controllers;

import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Profile("!development")
@Controller
public class FrontendController {
  @GetMapping("/**/{path:[^\\.]*}")
  public String index() {
    return "forward:/index.html";
  }

  @GetMapping("/csrf")
  public ResponseEntity<?> csrf() {
      return ResponseEntity.notFound().build();
  }

}