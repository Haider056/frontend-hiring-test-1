import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CallDetails from './CallDetails';
import { fetchCalls, archiveCall} from '../services/calls';

const CallList = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 10;

  const fetchCallsData = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const offset = (page - 1) * itemsPerPage;
      const data = await fetchCalls(offset, itemsPerPage);
      setCalls(data.nodes);
      setTotalPages(Math.ceil(data.totalCount / itemsPerPage));
      setHasNextPage(data.hasNextPage);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch calls');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallsData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (filter === 'Archived') {
      setCalls(calls.filter(call => call.is_archived));
    } else if (filter) {
      setCalls(calls.filter(call => call.call_type === filter));
    } else {
      fetchCallsData(currentPage);
    }
  }, [filter,currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleViewDetails = (call) => {
    setSelectedCall(call);
    setShowModal(true);
  };

  const toggleArchive = async (callId, isArchived) => {
    try {
      await archiveCall(callId);
      const updatedCalls = calls.map(call =>
        call.id === callId ? { ...call, is_archived: !isArchived } : call
      );
      setCalls(updatedCalls);
    } catch (error) {
      console.error(`Failed to ${isArchived ? 'unarchive' : 'archive'} call`, error);
    }
  };

  const renderDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes} minutes ${seconds} seconds (${duration} seconds)`;
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const groupCallsByDate = (calls) => {
    return calls.reduce((groups, call) => {
      const date = new Date(call.created_at).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(call);
      return groups;
    }, {});
  };
  const groupedCalls = groupCallsByDate(calls);
  
  const renderStatusButton = (call) => {
    return call.is_archived ? (
      <button className="btn btn-outline-success btn-sm" onClick={(e) => { e.stopPropagation(); toggleArchive(call.id, call.is_archived); }}>Unarchive</button>
    ) : (
      <button className="btn btn-outline-secondary btn-sm" onClick={(e) => { e.stopPropagation(); toggleArchive(call.id, call.is_archived); }}>Archive</button>
    );
  };

  const renderCallType = (callType, call) => {
    let className = '';
    switch (callType) {
      case 'voicemail':
        className = 'text-primary';
        break;
      case 'answered':
        className = 'text-success';
        break;
      case 'missed':
        className = 'text-danger';
        break;
      default:
        className = '';
    }
    return (
      <span className={className} onClick={(e) => { e.stopPropagation(); handleViewDetails(call); }}>
        {callType}
      </span>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container">
      <h2 className="my-4">Turing Technologies Frontend Test</h2>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <label>Filter by:</label>
          <select
            className="form-control d-inline-block ml-2"
            style={{ width: 'auto' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="voicemail">Voice Mail</option>
            <option value="answered">Answered</option>
            <option value="missed">Missed</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>
      <table className="table table-bordered">
  <thead className="thead-light">
    <tr>
      <th>CALL TYPE</th>
      <th>DIRECTION</th>
      <th>DURATION</th>
      <th>FROM</th>
      <th>TO</th>
      <th>VIA</th>
      <th>DATE</th>
      <th>STATUS</th>
      <th>ACTIONS</th>
    </tr>
  </thead>
  <tbody>
    {Object.entries(groupedCalls).map(([date, callsForDate]) => (
      <React.Fragment key={date}>
      
        {callsForDate.map((call) => (
          <tr key={call.id}>
            <td>{renderCallType(call.call_type, call)}</td>
            <td className="text-primary">{call.direction}</td>
            <td>{renderDuration(call.duration)}</td>
            <td>{call.from}</td>
            <td>{call.to}</td>
            <td>{call.via}</td>
            <td>{formatDate(call.created_at)}</td>
            <td>{renderStatusButton(call)}</td>
            <td>
              <button
                className="btn btn-primary btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(call);
                }}
              >
                Add Note
              </button>
            </td>
          </tr>
        ))}
      </React.Fragment>
    ))}
  </tbody>
</table>

      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <a onClick={() => handlePageChange(currentPage - 1)} className="page-link" style={{ cursor: 'pointer' }}>
              Previous
            </a>
          </li>
          {pageNumbers.map(number => (
            <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
              <a onClick={() => handlePageChange(number)} className="page-link" style={{ cursor: 'pointer' }}>
                {number}
              </a>
            </li>
          ))}
          <li className={`page-item ${!hasNextPage ? 'disabled' : ''}`}>
            <a onClick={() => handlePageChange(currentPage + 1)} className="page-link" style={{ cursor: 'pointer' }}>
              Next
            </a>
          </li>
        </ul>
      </nav>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Call Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCall && <CallDetails call={selectedCall} />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CallList;
