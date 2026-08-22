package CodeForge.com.DayFlow.controller;

import CodeForge.com.DayFlow.dto.DashboardResponse;
import CodeForge.com.DayFlow.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard(HttpServletRequest request) {
        // The employeeId is set in the request attributes by the JwtInterceptor
        String employeeId = (String) request.getAttribute("employeeId");
        
        DashboardResponse response = employeeService.getDashboardData(employeeId);
        return ResponseEntity.ok(response);
    }

    @org.springframework.web.bind.annotation.PostMapping("/upload-profile-image")
    public ResponseEntity<String> uploadProfileImage(HttpServletRequest request, @org.springframework.web.bind.annotation.RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        String employeeId = (String) request.getAttribute("employeeId");
        try {
            String fileUrl = employeeService.uploadProfileImage(employeeId, file);
            return ResponseEntity.ok(fileUrl);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error uploading file: " + e.getMessage());
        }
    }
}
