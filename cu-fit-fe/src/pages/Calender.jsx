import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-hot-toast";

const CalendarPage = () => {
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState([]);

  const handleDateClick = (date) => {
    if (
      selectedDates.some(
        (selectedDate) => selectedDate.toDateString() === date.toDateString()
      )
    ) {
      // If date is already selected, remove it
      setSelectedDates(
        selectedDates.filter(
          (selectedDate) => selectedDate.toDateString() !== date.toDateString()
        )
      );
    } else if (selectedDates.length < 4) {
      // Add new date if less than 4 dates are selected
      setSelectedDates([...selectedDates, date]);
    } else {
      alert("You can only select up to 4 rest days!");
    }
  };

  const tileClassName = ({ date }) => {
    if (
      selectedDates.some(
        (selectedDate) => selectedDate.toDateString() === date.toDateString()
      )
    ) {
      return "selected-date";
    }
    return null;
  };

  const handleReset = () => {
    setSelectedDates([]);
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch("http://localhost:8000/update-profile/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ rest_days: selectedDates.join(",") }),
      });
      if (response.ok) {
        toast.success("Rest days saved successfully!");
        navigate("/bmi-calculator");
      } else {
        toast.error("Failed to save rest days. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to save rest days. Please try again.");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <CalendarContainer>
      <Header>Workout Calendar</Header>
      <h2>Select Your Rest Days</h2>
      <p>
        Choose up to 4 days when you don't want to follow the exercise/diet plan
      </p>

      <Calendar
        onChange={handleDateClick}
        value={null}
        tileClassName={tileClassName}
      />

      <SelectedDatesSection>
        <h3>Selected Rest Days ({selectedDates.length}/4):</h3>
        <ul>
          {selectedDates.map((date, index) => (
            <li key={index}>
              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </li>
          ))}
        </ul>
        <ButtonContainer>
          <Button onClick={handleReset} isReset>
            Reset Dates
          </Button>
          <Button onClick={handleConfirm} disabled={selectedDates.length === 0}>
            Confirm Days
          </Button>
        </ButtonContainer>
      </SelectedDatesSection>
    </CalendarContainer>
  );
};

const CalendarContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  h2 {
    color: #333;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    margin-bottom: 2rem;
  }

  /* Style for selected dates */
  .selected-date {
    background-color: #ff6b6b !important;
    color: white !important;
  }

  /* Override default calendar styles */
  .react-calendar {
    width: 100%;
    border: none;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }
`;

const SelectedDatesSection = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;

  h3 {
    color: #333;
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      background-color: #f8f8f8;
      padding: 0.5rem 1rem;
      margin-bottom: 0.5rem;
      border-radius: 4px;
      color: #333;
    }
  }
`;

const Header = styled.h1`
  text-align: center;
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(props) =>
    props.isReset
      ? `
    background-color: #e74c3c;
    color: white;
    
    &:hover {
      background-color: #c0392b;
    }
  `
      : `
    background-color: #16a34a;
    color: white;
    
    &:hover {
      background-color: #15803d;
    }
    
    &:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }
  `}
`;

export default CalendarPage;
