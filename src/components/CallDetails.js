import React, { useEffect, useState } from 'react';
import axiosInstance from '../Utlis/axiosConfig';

const CallDetails = ({ call }) => {
  const [note, setNote] = useState('');
  const [callDetails, setCallDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCallDetails = async () => {
      try {
        const response = await axiosInstance.get(`/calls/${call.id}`);
        setCallDetails(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch call details');
        setLoading(false);
      }
    };
    fetchCallDetails();
  }, [call.id]);

  const handleAddNote = async () => {
    try {
      const response = await axiosInstance.post(`/calls/${call.id}/note`, { content: note });
      setCallDetails(response.data);
      setNote('');
    } catch (error) {
      console.error('Failed to add note', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!callDetails) return null;

  return (
    <div>
      <p><strong>Type:</strong> {callDetails.call_type}</p>
      <p><strong>Direction:</strong> {callDetails.direction}</p>
      <p><strong>From:</strong> {callDetails.from}</p>
      <p><strong>To:</strong> {callDetails.to}</p>
      <p><strong>Created At:</strong> {callDetails.created_at}</p>

      <div className="form-group">
        <label htmlFor="note">Add Note</label>
        <textarea
          className="form-control"
          id="note"
          rows="3"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
      </div>
      <button type="button" className="btn btn-primary" onClick={handleAddNote}>Save Note</button>

      <h5 className="mt-4">Notes</h5>
      <ul className="list-group">
        {callDetails.notes.map((note) => (
          <li key={note.id} className="list-group-item">
            {note.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CallDetails;
