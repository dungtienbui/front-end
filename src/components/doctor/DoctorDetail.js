import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3001/doctors';
const token = localStorage.getItem('token');

function DoctorDetail() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctor(response.data);
      } catch (error) {
        console.error('Error fetching doctor details:', error);
        alert(error.response?.data?.error || 'An error occurred while fetching the doctor details');
      }
    };

    fetchDoctor();
  }, [id]);

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Doctor Details</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{doctor.name}</h5>
          <p className="card-text"><strong>Specialization:</strong> {doctor.specialization}</p>
          <p className="card-text"><strong>Phone Number:</strong> {doctor.phone}</p>
        </div>
      </div>
    </div>
  );
}

export default DoctorDetail;
