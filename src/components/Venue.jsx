import React, { useState, useEffect } from 'react';
import './css/Venue.css'; 

const Venue = () => {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [form, setForm] = useState({ id: '', name: '', location: '' , Desc:"",capacity:""});

  
  useEffect(() => {
   
    const fetchAllVenues = async () => {
      try {
        const response = await fetch('/venues'); 
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setVenues(data);
        saveToLocalStorage('venues', data); // Save to localStorage
      } catch (error) {
        console.error('Error fetching venues:', error);
        const localData = getFromLocalStorage('venues');
        setVenues(localData); 
      }
    };

    fetchAllVenues();
  }, []);

  const fetchVenueById = async (id) => {
    try {
      const response = await fetch(`/venues/${id}`); 
      const data = await response.json();
      setSelectedVenue(data);
      
    } catch (error) {
      console.error('Error fetching venue:', error);
      const localData = getFromLocalStorage('venues');
      const venue = localData.find(v => v.id === id);
      setSelectedVenue(venue);
    }
  };

  const createVenue = async () => {
    try {
      const response = await fetch('/venues', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const newVenue = await response.json();
      setVenues([...venues, newVenue]);
      setForm({ id: '', name: '', location: '',Desc:"",capacity:""});
    } catch (error) {
      console.error('Error creating venue:', error);
      const localData = getFromLocalStorage('venues');
      const updatedData = [...localData, form];
      saveToLocalStorage('venues', updatedData);
      setVenues(updatedData);
    }
  };

  const updateVenue = async () => {
    try {
      const response = await fetch(`/venues/${form.id}`, { // Replace with your API endpoint
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const updatedVenue = await response.json();
      setVenues(venues.map(v => (v.id === form.id ? updatedVenue : v)));
      setForm({ id: '', name: '', location: '',Desc:"",capacity:""});
    } catch (error) {
      console.error('Error updating venue:', error);
      const localData = getFromLocalStorage('venues');
      const updatedData = localData.map(v => (v.id === form.id ? form : v)); 
      saveToLocalStorage('venues', updatedData);
      setVenues(updatedData);
    }
  };

  const deleteVenue = async (id) => {
    try {
      await fetch(`/venues/${id}`, { 
        method: 'DELETE',
      });
      setVenues(venues.filter(v => v.id !== id));
    } catch (error) {
      console.error('Error deleting venue:', error);
      const localData = getFromLocalStorage('venues');
      const updatedData = localData.filter(v => v.id !== id); 
      saveToLocalStorage('venues', updatedData);
      setVenues(updatedData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    form.id ? updateVenue() : createVenue();
  };
  const handleCloseModal = () => {
    setSelectedVenue(null);
  };

  return (
    <div className="app">
      <h1>Venue Management</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleInputChange} required />
        <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleInputChange} required />
        <input type="text" name="Desc" placeholder="Description" value={form.Desc} onChange={handleInputChange} required />
        <input type="number" name="capacity" placeholder="capacity" value={form.capacity} onChange={handleInputChange} required />
        {form.id && <button className='btn' type="button" onClick={() => setForm({ id: '', name: '', location: '' ,Desc:"", capacity:""})}>Cancel Edit</button>}
        <button className='btn' type="submit">{form.id ? 'Update' : 'Create'} Venue</button>
      </form>
      <div className="venue-list">
        {venues.map(venue => (
          <div key={venue.id} className="venue-item">
            <h2>{venue.name}</h2>
            <p>{venue.location}</p>
            <p>{venue.Desc}</p>
            <p>{venue.capacity}</p>
            <button onClick={() => setForm(venue)}>Edit</button>
            <button onClick={() => deleteVenue(venue.id)}>Delete</button>
            <button onClick={() => fetchVenueById(venue.id)}>Details</button>
          </div>
        ))}
      </div>
      {selectedVenue && (
         <div className="modal" onClick={handleCloseModal}>
         <div className="modal-content" onClick={e => e.stopPropagation()}>
           <span className="close" onClick={handleCloseModal}>&times;</span>
          <h2>Venue Details</h2>
          <p>Name: {selectedVenue.name}</p>
          <p>Location: {selectedVenue.location}</p>
          <p>Description: {selectedVenue.Desc}</p>
          <p>Capacity: {selectedVenue.capacity}</p>
        </div>
        </div>
      )}
    </div>
  );
};

 const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

export const getFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving data from localStorage:', error);
    return [];
  }
};

export const clearLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing data from localStorage:', error);
  }
};



export default Venue;
