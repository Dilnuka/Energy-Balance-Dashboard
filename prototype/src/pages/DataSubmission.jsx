import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

const DataSubmission = () => {
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = () => {
    setUploaded(true);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h2>Data Submission Portal</h2>
        <p>Upload multi-sector energy templates for automated validation and balancing.</p>
      </div>

      <div className="card" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0 }}>Bulk Upload: Electricity Sector (CEB)</h3>
          <button className="btn btn-outline">Download Template (XLSX)</button>
        </div>

        {!uploaded ? (
          <div className="upload-zone" onClick={handleUpload}>
            <UploadCloud size={48} className="upload-icon" />
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Drag and drop your Excel file here</h3>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>or click to browse from your computer</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Supported formats: .xlsx, .csv (Max 10MB)</p>
          </div>
        ) : (
          <div style={{ border: '1px solid var(--accent-green)', backgroundColor: '#ecfdf5', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileText size={24} color="var(--accent-green)" />
              <div>
                <div style={{ fontWeight: 600, color: '#065f46' }}>CEB_Annual_Generation_2023.xlsx</div>
                <div style={{ fontSize: '0.75rem', color: '#047857' }}>Uploaded successfully • 2.4 MB</div>
              </div>
            </div>
            <button className="btn btn-outline" onClick={() => setUploaded(false)}>Remove</button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" disabled={!uploaded}>
            Run Validation Engine <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <h3 style={{ marginBottom: '16px' }}>Recent Submissions & Validation Logs</h3>
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Submission ID</th>
                <th>Data Provider</th>
                <th>Dataset Period</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#SUB-8092</td>
                <td>Ceylon Petroleum Corp.</td>
                <td>Q4 2023</td>
                <td><span className="status-badge status-success"><CheckCircle size={12} style={{ marginRight: '4px' }}/> Validated</span></td>
                <td><button className="btn btn-outline" style={{ padding: '4px 12px' }}>View Report</button></td>
              </tr>
              <tr>
                <td>#SUB-8091</td>
                <td>Private Solar IPP</td>
                <td>Annual 2023</td>
                <td><span className="status-badge status-warning"><AlertTriangle size={12} style={{ marginRight: '4px' }}/> Plausibility Warning</span></td>
                <td><button className="btn btn-primary" style={{ padding: '4px 12px' }}>Review Errors</button></td>
              </tr>
              <tr>
                <td>#SUB-8090</td>
                <td>Lanka IOC</td>
                <td>Q3 2023</td>
                <td><span className="status-badge status-success"><CheckCircle size={12} style={{ marginRight: '4px' }}/> Approved</span></td>
                <td><button className="btn btn-outline" style={{ padding: '4px 12px' }}>View Report</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataSubmission;
