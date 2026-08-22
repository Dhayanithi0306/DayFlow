package CodeForge.com.DayFlow.service;

import CodeForge.com.DayFlow.dto.AuthResponse;
import CodeForge.com.DayFlow.dto.SignInRequest;
import CodeForge.com.DayFlow.dto.SignUpRequest;
import CodeForge.com.DayFlow.entity.Employee;
import CodeForge.com.DayFlow.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public AuthResponse signUp(SignUpRequest request) {
        if (employeeRepository.findByEmail(request.getEmail()).isPresent()) {
            return new AuthResponse(false, "Email is already registered", null, null);
        }

        if (employeeRepository.findByEmployeeId(request.getEmployeeId()).isPresent()) {
            return new AuthResponse(false, "Employee ID is already registered", null, null);
        }

        Employee employee = new Employee();
        employee.setEmployeeId(request.getEmployeeId());
        employee.setEmail(request.getEmail());
        employee.setPassword(hashPassword(request.getPassword()));
        employee.setRole(request.getRole());
        employee.setEmailVerified(false); // Default to false as per requirement

        employeeRepository.save(employee);

        return new AuthResponse(true, "Sign up successful. Please verify your email.", employee.getEmployeeId(), employee.getRole().name());
    }

    public AuthResponse signIn(SignInRequest request) {
        Optional<Employee> employeeOpt = employeeRepository.findByEmail(request.getEmail());
        if (employeeOpt.isEmpty()) {
            return new AuthResponse(false, "Invalid email or password", null, null);
        }

        Employee employee = employeeOpt.get();

        if (!employee.getPassword().equals(hashPassword(request.getPassword()))) {
            return new AuthResponse(false, "Invalid email or password", null, null);
        }

        if (!employee.isEmailVerified()) {
            return new AuthResponse(false, "Please verify your email before signing in", null, null);
        }

        return new AuthResponse(true, "Sign in successful. Redirecting to dashboard...", employee.getEmployeeId(), employee.getRole().name());
    }

    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
}
