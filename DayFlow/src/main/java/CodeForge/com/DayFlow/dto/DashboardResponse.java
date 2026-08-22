package CodeForge.com.DayFlow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private String name;
    private String employeeId;
    private String profileImageUrl;
    private List<String> recentActivity;
}
