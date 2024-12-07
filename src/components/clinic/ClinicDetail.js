import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = 'http://localhost:3001/clinics';
const DOCTORS_API_URL = 'http://localhost:3001/doctors';
const token = localStorage.getItem('token');

function ClinicDetail() {
  const { id } = useParams();
  const [clinic, setClinic] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [newDoctorId, setNewDoctorId] = useState('');

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClinic(response.data);

        // Fetch doctors and all doctors after clinic data is fetched
        await fetchDoctors();
        await fetchAllDoctors();
      } catch (error) {
        console.error('Error fetching clinic details:', error);
        alert(error.response?.data?.error || 'An error occurred while fetching the clinic details');
      } finally {
        setLoading(false);
      }
    };

    fetchClinic();
  }, [id]);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}/doctors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(response.data.doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      alert(error.response?.data?.error || 'An error occurred while fetching the doctors');
    }
  };

  const fetchAllDoctors = async () => {
    try {
      const response = await axios.get(DOCTORS_API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllDoctors(response.data);
    } catch (error) {
      console.error('Error fetching all doctors:', error);
      alert(error.response?.data?.error || 'An error occurred while fetching all doctors');
    }
  };

  const getAvailableDoctors = () => {
    return allDoctors.filter(doctor =>
      !doctors.some(d => d.id === doctor.id)
    );
  };

  const handleAddDoctor = async () => {
    if (!newDoctorId) {
      alert('Please select a doctor to add.');
      return;
    }

    try {
      const requestBody = {
        startDate: new Date().toISOString().split('T')[0] // Lấy ngày hiện tại theo định dạng 'YYYY-MM-DD'
      };

      // Gửi yêu cầu thêm bác sĩ vào trạm xá
      await axios.post(`${API_BASE_URL}/${id}/workAt-clinic/${newDoctorId}`, requestBody, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Cập nhật lại danh sách bác sĩ từ server sau khi thêm thành công
      await fetchDoctors(); // Gọi hàm này để làm mới danh sách bác sĩ

      setNewDoctorId('');
      setShowAddDoctorModal(false);
      alert('Doctor added successfully!');
    } catch (error) {
      console.error('Error adding doctor:', error);
      alert(error.response?.data?.error || 'An error occurred while adding the doctor');
    }
  };

  const handleRemoveDoctor = async (doctorId) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}/workAt-clinic/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(doctors.filter(doctor => doctor.id !== doctorId)); // Remove the doctor from the list
      alert('Doctor removed successfully!');
    } catch (error) {
      console.error('Error removing doctor:', error);
      alert(error.response?.data?.error || 'An error occurred while removing the doctor');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!clinic) {
    return <div>Error: Clinic details not found</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Clinic Details</h2>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{clinic.name}</h5>
          <p className="card-text"><strong>Address:</strong> {clinic.address}</p>
          <p className="card-text"><strong>Phone Number:</strong> {clinic.phoneNumber}</p>
          <p className="card-text"><strong>Open Time:</strong> {clinic.openTime}</p>
          <p className="card-text"><strong>Close Time:</strong> {clinic.closeTime}</p>
        </div>
      </div>
      <h3 className="text-center mb-4">Doctors at this Clinic</h3>
      {doctors.length > 0 ? (
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Specialization</th>
              <th>Start Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doctor => (
              <tr key={doctor.id}>
                <td>{doctor.name}</td>
                <td>{doctor.phone}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.startDate}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveDoctor(doctor.id)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No doctors found works at this clinic.</p>
      )}
      <Button onClick={() => setShowAddDoctorModal(true)} className="btn btn-primary mt-3">Assign Doctor</Button>

      {/* Add Doctor Modal */}
      <Modal show={showAddDoctorModal} onHide={() => setShowAddDoctorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Doctor to Clinic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Doctor</Form.Label>
              <Form.Control
                as="select"
                value={newDoctorId}
                onChange={(e) => setNewDoctorId(e.target.value)}
              >
                <option value="">Select a doctor</option>
                {getAvailableDoctors().map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} (ID: {doctor.id})
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={handleAddDoctor}>
              Add Doctor
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ClinicDetail;
