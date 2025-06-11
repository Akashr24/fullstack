package pkg1;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
     WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Allow all 
                        .allowedOrigins("http://127.0.0.1:5501") // Allow your 
                        .allowedMethods("*") // Allow all HTTP methods: GET, POST, DELETE, etc.
                        .allowedHeaders("*") // Allow all headers
                        .allowCredentials(true); // Allow credentials (optional)
            }
        };
    }
}
