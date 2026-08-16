package com.smarthospital.dto;

import lombok.Data;

@Data
public class DashboardResponseDTO {

    private long totalPatients;
    private long activePatients;

    private long totalDoctors;
    private long activeDoctors;

    private long totalAppointments;
    private long pendingAppointments;
    private long completedAppointments;
    private long cancelledAppointments;

    private long totalLabOrders;
    private long pendingLabOrders;
    private long completedLabOrders;

    private long totalPrescriptions;

    private long totalInventoryItems;
    private long lowStockItems;
    private long expiredInventoryItems;
}