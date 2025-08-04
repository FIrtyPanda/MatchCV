// pages/MatchCV.jsx
import React from 'react';
import Dashboard from '../layouts/Dashboard';
import MatchCVBoard from '../components/MatchCVBoard';
import { useState, useEffect } from 'react';

const MatchCV = () => {
  const [uploadId, setUploadId] = useState(null)

  useEffect(() => {
    const handler = (e) => setUploadId(e.detail)
    const last = localStorage.getItem("last_upload_id")
    if (last) setUploadId(Number(last))

    window.addEventListener("selectUpload", handler)
    return () => window.removeEventListener("selectUpload", handler)
  }, [])

  useEffect(() => {
    if (uploadId) localStorage.setItem("last_upload_id", uploadId)
    else localStorage.removeItem("last_upload_id")
  }, [uploadId])

  return (
    <Dashboard>
      <MatchCVBoard uploadId={uploadId} onUpload={(id) => setUploadId(id)} />
    </Dashboard>
  )
}

export default MatchCV;