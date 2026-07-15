package com.expensetracker.service;

import com.expensetracker.dto.BillRequest;
import com.expensetracker.dto.BillResponse;
import com.expensetracker.entity.Bill;
import com.expensetracker.entity.User;
import com.expensetracker.exception.BillNotFoundException;
import com.expensetracker.mapper.BillMapper;
import com.expensetracker.repository.BillRepository;
import com.expensetracker.util.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of {@link BillService}.
 */
@Service
public class BillServiceImpl implements BillService {

    private final BillRepository billRepository;
    private final BillMapper     billMapper;

    public BillServiceImpl(BillRepository billRepository, BillMapper billMapper) {
        this.billRepository = billRepository;
        this.billMapper     = billMapper;
    }

    @Override
    @Transactional
    public BillResponse createBill(BillRequest request) {
        User currentUser = SecurityUtils.getCurrentUser();
        Bill bill        = billMapper.toEntity(request, currentUser);
        Bill saved       = billRepository.save(bill);
        return billMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public BillResponse getBillById(Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        Bill bill = billRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new BillNotFoundException(id));
        return billMapper.toResponse(bill);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BillResponse> getAllBills() {
        Long userId = SecurityUtils.getCurrentUserId();
        return billRepository.findByUserIdOrderByNextDueDateAsc(userId)
                .stream()
                .map(billMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BillResponse> getUnpaidBills() {
        Long userId = SecurityUtils.getCurrentUserId();
        return billRepository.findByUserIdAndIsPaidFalseOrderByNextDueDateAsc(userId)
                .stream()
                .map(billMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BillResponse> getPaidBills() {
        Long userId = SecurityUtils.getCurrentUserId();
        return billRepository.findByUserIdAndIsPaidTrue(userId)
                .stream()
                .map(billMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BillResponse> getUpcomingBills(int daysAhead) {
        Long userId       = SecurityUtils.getCurrentUserId();
        LocalDate today   = LocalDate.now();
        LocalDate horizon = today.plusDays(daysAhead);
        return billRepository.findUpcomingBills(userId, today, horizon)
                .stream()
                .map(billMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BillResponse updateBill(Long id, BillRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        Bill bill = billRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new BillNotFoundException(id));
        billMapper.updateEntity(bill, request);
        Bill updated = billRepository.save(bill);
        return billMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public BillResponse markAsPaid(Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        Bill bill = billRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new BillNotFoundException(id));
        bill.setPaid(true);
        bill.setLastPaidDate(LocalDate.now());
        Bill saved = billRepository.save(bill);
        return billMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteBill(Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        Bill bill = billRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new BillNotFoundException(id));
        billRepository.delete(bill);
    }
}
