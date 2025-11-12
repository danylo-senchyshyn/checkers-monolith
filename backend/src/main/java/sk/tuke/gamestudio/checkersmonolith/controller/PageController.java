package sk.tuke.gamestudio.checkersmonolith.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping(value = {"/", "/rules", "/about", "/reviews", "/leaderboard", "/game"})
    public String index() {
        return "index.html";
    }
}