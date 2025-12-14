import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
const TeamRequests = () => {
  const { ideaId } = useParams();
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`/api/teams/requests/${ideaId}`);
      setRequests(res.data);
    };
    fetch();
  }, [ideaId]);
  const approve = async (reqId) => {
    await axios.put(`/api/teams/approve/${reqId}`);
    setRequests(reqs => reqs.map(r => r._id === reqId ? { ...r, status: 'approved' } : r));
  };
  const deny = async (reqId) => {
    await axios.put(`/api/teams/deny/${reqId}`);
    setRequests(reqs => reqs.map(r => r._id === reqId ? { ...r, status: 'rejected' } : r));
  };
  return (
    <>
      <Navbar />
      <div className="p-4">
        <h1>Team Requests</h1>
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req._id} className="border p-4 rounded">
              <p>{req.requester.name}</p>
              {req.status === 'pending' && (
                <>
                  <button onClick={() => approve(req._id)} className="bg-green-500 text-white px-2 py-1">Approve</button>
                  <button onClick={() => deny(req._id)} className="bg-red-500 text-white px-2 py-1 ml-2">Deny</button>
                </>
              )}
              <p>Status: {req.status}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default TeamRequests;