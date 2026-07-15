package com.expensetracker.controller;

import com.expensetracker.dto.ApiResponse;
import com.expensetracker.dto.BillRequest;
import com.expensetracker.dto.BillResponse;
import com.expensetracker.service.BillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for bill CRUD and payment tracking endpoints.
 */
@RestController
@RequestMapping("/api/bills")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BillResponse>> createBill(
            @Valid @RequestBody BillRequest request) {
        BillResponse response = billService.createBill(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Bill created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BillResponse>>> getAllBills() {
        return ResponseEntity.ok(ApiResponse.success(billService.getAllBills()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BillResponse>> getBillById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(billService.getBillById(id)));
    }

    @GetMapping("/unpaid")
    public ResponseEntity<ApiResponse<List<BillResponse>>> getUnpaidBills() {
        return ResponseEntity.ok(ApiResponse.success(billService.getUnpaidBills()));
    }

    @GetMapping("/paid")
    public ResponseEntity<ApiResponse<List<BillResponse>>> getPaidBills() {
        return ResponseEntity.ok(ApiResponse.success(billService.getPaidBills()));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<BillResponse>>> getUpcomingBills(
            @RequestParam(defaultValue = "30") int daysAhead) {
        return ResponseEntity.ok(ApiResponse.success(billService.getUpcomingBills(daysAhead)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BillResponse>> updateBill(
            @PathVariable Long id,
            @Valid @RequestBody BillRequest request) {
        BillResponse response = billService.updateBill(id, request);
        return ResponseEntity.ok(ApiResponse.success("Bill updated successfully", response));
    }

    @PatchMapping("/{id}/pay")
    public ResponseEntity<ApiResponse<BillResponse>> markAsPaid(@PathVariable Long id) {
        BillResponse response = billService.markAsPaid(id);
        return ResponseEntity.ok(ApiResponse.success("Bill marked as paid", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBill(@PathVariable Long id) {
        billService.deleteBill(id);
        return ResponseEntity.ok(ApiResponse.success("Bill deleted successfully"));
    }
}
