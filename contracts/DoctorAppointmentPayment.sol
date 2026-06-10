// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title DoctorAppointmentPayment
 * @dev Smart contract to handle payments for doctor appointments
 */
contract DoctorAppointmentPayment {
    
    // Struct to store appointment details
    struct Appointment {
        address patient;
        address doctor;
        uint256 amount;
        uint256 timestamp;
        bool paid;
        string appointmentId;
    }
    
    // Events
    event PaymentReceived(
        string indexed appointmentId,
        address indexed patient,
        address indexed doctor,
        uint256 amount,
        uint256 timestamp
    );
    
    event PaymentReleased(
        string indexed appointmentId,
        address indexed doctor,
        uint256 amount
    );
    
    // Mappings
    mapping(string => Appointment) public appointments;
    mapping(address => uint256) public doctorBalance;
    mapping(string => bool) public appointmentExists;
    
    // Owner of contract
    address public owner;
    
    // Constructor
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Receive payment for appointment
     * @param appointmentId The appointment ID from the database
     * @param doctor The doctor's wallet address
     */
    function payForAppointment(
        string memory appointmentId,
        address doctor
    ) public payable {
        require(msg.value > 0, "Payment amount must be greater than 0");
        require(doctor != address(0), "Invalid doctor address");
        require(!appointmentExists[appointmentId], "Appointment already paid");
        
        // Create appointment record
        appointments[appointmentId] = Appointment({
            patient: msg.sender,
            doctor: doctor,
            amount: msg.value,
            timestamp: block.timestamp,
            paid: true,
            appointmentId: appointmentId
        });
        
        appointmentExists[appointmentId] = true;
        doctorBalance[doctor] += msg.value;
        
        emit PaymentReceived(appointmentId, msg.sender, doctor, msg.value, block.timestamp);
    }
    
    /**
     * @dev Release payment to doctor
     * @param appointmentId The appointment ID
     */
    function releasePaymentToDoctor(string memory appointmentId) public {
        Appointment memory appointment = appointments[appointmentId];
        
        require(appointmentExists[appointmentId], "Appointment does not exist");
        require(appointment.paid, "Appointment not paid");
        require(msg.sender == owner || msg.sender == appointment.doctor, "Unauthorized");
        
        uint256 amount = appointment.amount;
        require(amount > 0, "No balance to release");
        
        // Update balance
        doctorBalance[appointment.doctor] -= amount;
        
        // Transfer funds to doctor
        (bool success, ) = payable(appointment.doctor).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit PaymentReleased(appointmentId, appointment.doctor, amount);
    }
    
    /**
     * @dev Get doctor's balance
     * @param doctor The doctor's wallet address
     */
    function getDoctorBalance(address doctor) public view returns (uint256) {
        return doctorBalance[doctor];
    }
    
    /**
     * @dev Get appointment details
     * @param appointmentId The appointment ID
     */
    function getAppointmentDetails(string memory appointmentId) 
        public 
        view 
        returns (Appointment memory) 
    {
        return appointments[appointmentId];
    }
    
    /**
     * @dev Withdraw balance (only for contract owner in emergency)
     */
    function emergencyWithdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Receive ETH transfers
     */
    receive() external payable {}
    
    /**
     * @dev Fallback function
     */
    fallback() external payable {}
}
