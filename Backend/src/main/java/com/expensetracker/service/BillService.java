package com.expensetracker.service;

import com.expensetracker.dto.BillRequest;
import com.expensetracker.dto.BillResponse;

import java.util.List;

/**
 * Contract for bill CRUD operations and payment tracking.
 */
public interface BillService {

    BillResponse createBill(BillRequest request);

    BillResponse getBillById(Long id);

    List<BillResponse> getAllBills();

    List<BillResponse> getUnpaidBills();

    List<BillResponse> getPaidBills();

    List<BillResponse> getUpcomingBills(int daysAhead);

    BillResponse updateBill(Long id, BillRequest request);

    BillResponse markAsPaid(Long id);

    void deleteBill(Long id);
}
