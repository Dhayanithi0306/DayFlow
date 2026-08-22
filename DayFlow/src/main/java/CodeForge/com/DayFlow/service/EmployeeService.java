package CodeForge.com.DayFlow.service;

import CodeForge.com.DayFlow.dto.DashboardResponse;
import CodeForge.com.DayFlow.entity.Employee;
import CodeForge.com.DayFlow.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Optional;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public DashboardResponse getDashboardData(String employeeId) {
        Optional<Employee> employeeOpt = employeeRepository.findByEmployeeId(employeeId);
        
        if (employeeOpt.isEmpty()) {
            throw new RuntimeException("Employee not found");
        }

        Employee employee = employeeOpt.get();

        // Placeholder for recent activity until we build the full activity log feature
        java.util.List<String> mockActivity = Arrays.asList(
                "Logged in successfully",
                "Viewed Dashboard"
        );

        return new DashboardResponse(
                employee.getName(),
                employee.getEmployeeId(),
                employee.getProfileImageUrl(),
                mockActivity
        );
    }

    public String uploadProfileImage(String employeeId, org.springframework.web.multipart.MultipartFile file) throws java.io.IOException {
        Optional<Employee> employeeOpt = employeeRepository.findByEmployeeId(employeeId);
        if (employeeOpt.isEmpty()) {
            throw new RuntimeException("Employee not found");
        }

        Employee employee = employeeOpt.get();

        java.nio.file.Path uploadDir = java.nio.file.Paths.get("uploads");
        if (!java.nio.file.Files.exists(uploadDir)) {
            java.nio.file.Files.createDirectories(uploadDir);
        }

        String fileName = employeeId + "_" + file.getOriginalFilename();
        java.nio.file.Path filePath = uploadDir.resolve(fileName);
        java.nio.file.Files.copy(file.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

        String fileUrl = "/uploads/" + fileName;
        employee.setProfileImageUrl(fileUrl);
        employeeRepository.save(employee);

        return fileUrl;
    }
}
