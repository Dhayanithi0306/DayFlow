package CodeForge.com.DayFlow.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private JwtInterceptor jwtInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // Protect all /api/employee/** routes
        registry.addInterceptor(jwtInterceptor)
                .addPathPatterns("/api/employee/**");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Expose the 'uploads' directory as a static resource path
        Path uploadDir = Paths.get("./uploads");
        String uploadPath = uploadDir.toFile().getAbsolutePath();
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath + "/");
    }
}
