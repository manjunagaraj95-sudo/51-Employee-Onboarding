
import React, { useState, useEffect } from 'react';

// Centralized Role-Based Access Control (RBAC) Configuration
const ROLES = {
    ADMIN: 'Admin',
    HR_TEAM: 'HR Team',
    HIRING_MANAGER: 'Hiring Manager',
    IT_TEAM: 'IT Team',
    EMPLOYEE: 'Employee',
};

// Standardized Status Keys and UI Labels
const STATUS_MAP = {
    // Onboarding Request Statuses
    'NEW_REQUEST': { label: 'New Request', color: 'status-purple', icon: '✨' },
    'PENDING_HR_REVIEW': { label: 'Pending HR Review', color: 'status-yellow', icon: '📝' },
    'PENDING_IT_SETUP': { label: 'Pending IT Setup', color: 'status-blue', icon: '💻' },
    'PENDING_FINANCE': { label: 'Pending Finance', color: 'status-blue', icon: '💸' },
    'APPROVED': { label: 'Approved', color: 'status-green', icon: '✅' },
    'REJECTED': { label: 'Rejected', color: 'status-red', icon: '❌' },
    'COMPLETED': { label: 'Completed', color: 'status-green', icon: '🎉' },
    'ARCHIVED': { label: 'Archived', color: 'status-gray', icon: '📦' },

    // Task Statuses
    'OPEN': { label: 'Open', color: 'status-purple', icon: '🆕' },
    'IN_PROGRESS': { label: 'In Progress', color: 'status-blue', icon: '⏳' },
    'TASK_COMPLETED': { label: 'Completed', color: 'status-green', icon: '✅' },
    'OVERDUE': { label: 'Overdue', color: 'status-red', icon: '🚨' },

    // SLA Statuses
    'ON_TRACK': { label: 'On Track', color: 'status-green', icon: '🟢' },
    'AT_RISK': { label: 'At Risk', color: 'status-yellow', icon: '🟡' },
    'BREACHED': { label: 'Breached', color: 'status-red', icon: '🔴' },

    // Employee Statuses
    'ACTIVE': { label: 'Active', color: 'status-green', icon: '🏃' },
    'ON_LEAVE': { label: 'On Leave', color: 'status-yellow', icon: '🌴' },
    'TERMINATED': { label: 'Terminated', color: 'status-red', icon: '🚪' },
};

// --- Dummy Data ---
const generateId = () => Math.random().toString(36).substring(2, 9);
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const DUMMY_USERS = [
    { id: 'usr-001', name: 'Alice Admin', email: 'alice.a@example.com', role: ROLES.ADMIN },
    { id: 'usr-002', name: 'Bob HR', email: 'bob.h@example.com', role: ROLES.HR_TEAM },
    { id: 'usr-003', name: 'Charlie Manager', email: 'charlie.m@example.com', role: ROLES.HIRING_MANAGER },
    { id: 'usr-004', name: 'Diana IT', email: 'diana.i@example.com', role: ROLES.IT_TEAM },
    { id: 'usr-005', name: 'Eve Employee', email: 'eve.e@example.com', role: ROLES.EMPLOYEE },
    { id: 'usr-006', name: 'Frank HR', email: 'frank.h@example.com', role: ROLES.HR_TEAM },
    { id: 'usr-007', name: 'Grace Manager', email: 'grace.m@example.com', role: ROLES.HIRING_MANAGER },
    { id: 'usr-008', name: 'Heidi IT', email: 'heidi.i@example.com', role: ROLES.IT_TEAM },
    { id: 'usr-009', name: 'Ivan Employee', email: 'ivan.e@example.com', role: ROLES.EMPLOYEE },
    { id: 'usr-010', name: 'Judy Admin', email: 'judy.a@example.com', role: ROLES.ADMIN },
];

const DUMMY_EMPLOYEES = [
    { id: 'emp-001', userId: 'usr-005', name: 'Eve Employee', email: 'eve.e@example.com', role: 'Software Engineer', department: 'Engineering', managerId: 'usr-003', managerName: 'Charlie Manager', status: STATUS_MAP.ACTIVE.label, startDate: '2023-01-15' },
    { id: 'emp-002', userId: 'usr-009', name: 'Ivan Employee', email: 'ivan.e@example.com', role: 'Marketing Specialist', department: 'Marketing', managerId: 'usr-007', managerName: 'Grace Manager', status: STATUS_MAP.ACTIVE.label, startDate: '2023-03-01' },
    { id: 'emp-003', userId: generateId(), name: 'Liam IT', email: 'liam.it@example.com', role: 'IT Support', department: 'IT', managerId: 'usr-004', managerName: 'Diana IT', status: STATUS_MAP.ACTIVE.label, startDate: '2022-11-20' },
    { id: 'emp-004', userId: generateId(), name: 'Olivia Finance', email: 'olivia.f@example.com', role: 'Financial Analyst', department: 'Finance', managerId: 'usr-002', managerName: 'Bob HR', status: STATUS_MAP.ON_LEAVE.label, startDate: '2023-02-10' },
    { id: 'emp-005', userId: generateId(), name: 'Noah Sales', email: 'noah.s@example.com', role: 'Sales Manager', department: 'Sales', managerId: 'usr-007', managerName: 'Grace Manager', status: STATUS_MAP.ACTIVE.label, startDate: '2023-04-05' },
    { id: 'emp-006', userId: generateId(), name: 'Sophia HR', email: 'sophia.h@example.com', role: 'HR Generalist', department: 'HR', managerId: 'usr-002', managerName: 'Bob HR', status: STATUS_MAP.ACTIVE.label, startDate: '2023-06-01' },
    { id: 'emp-007', userId: generateId(), name: 'Mia Designer', email: 'mia.d@example.com', role: 'UI/UX Designer', department: 'Product', managerId: 'usr-003', managerName: 'Charlie Manager', status: STATUS_MAP.ACTIVE.label, startDate: '2023-07-10' },
    { id: 'emp-008', userId: generateId(), name: 'Jacob Marketing', email: 'jacob.m@example.com', role: 'Marketing Lead', department: 'Marketing', managerId: 'usr-007', managerName: 'Grace Manager', status: STATUS_MAP.TERMINATED.label, startDate: '2023-02-20', endDate: '2023-08-01' },
];

const DUMMY_ONBOARDING_REQUESTS = [
    {
        id: 'req-001',
        employeeId: 'emp-001',
        employeeName: 'Eve Employee',
        position: 'Software Engineer',
        department: 'Engineering',
        managerId: 'usr-003',
        managerName: 'Charlie Manager',
        startDate: '2023-01-15',
        status: 'COMPLETED',
        slaStatus: 'ON_TRACK',
        createdDate: '2022-12-01',
        completionDate: '2023-01-20',
        documents: [{ name: 'Offer Letter.pdf', url: '#', type: 'PDF' }, { name: 'NDA.docx', url: '#', type: 'DOCX' }],
        workflow: ['NEW_REQUEST', 'PENDING_HR_REVIEW', 'PENDING_IT_SETUP', 'PENDING_FINANCE', 'APPROVED', 'COMPLETED'],
        currentWorkflowStage: 'COMPLETED',
    },
    {
        id: 'req-002',
        employeeId: 'emp-002',
        employeeName: 'Ivan Employee',
        position: 'Marketing Specialist',
        department: 'Marketing',
        managerId: 'usr-007',
        managerName: 'Grace Manager',
        startDate: '2023-03-01',
        status: 'APPROVED',
        slaStatus: 'ON_TRACK',
        createdDate: '2023-02-01',
        completionDate: null,
        documents: [{ name: 'Offer Letter.pdf', url: '#', type: 'PDF' }],
        workflow: ['NEW_REQUEST', 'PENDING_HR_REVIEW', 'PENDING_IT_SETUP', 'PENDING_FINANCE', 'APPROVED', 'COMPLETED'],
        currentWorkflowStage: 'APPROVED',
    },
    {
        id: 'req-003',
        employeeId: null, // New employee
        employeeName: 'New Dev Lead',
        position: 'Development Lead',
        department: 'Engineering',
        managerId: 'usr-003',
        managerName: 'Charlie Manager',
        startDate: '2023-11-01',
        status: 'PENDING_HR_REVIEW',
        slaStatus: 'AT_RISK',
        createdDate: '2023-10-10',
        completionDate: null,
        documents: [{ name: 'Offer Letter.pdf', url: '#', type: 'PDF' }],
        workflow: ['NEW_REQUEST', 'PENDING_HR_REVIEW', 'PENDING_IT_SETUP', 'PENDING_FINANCE', 'APPROVED', 'COMPLETED'],
        currentWorkflowStage: 'PENDING_HR_REVIEW',
    },
    {
        id: 'req-004',
        employeeId: null,
        employeeName: 'Junior Data Analyst',
        position: 'Data Analyst',
        department: 'Data Science',
        managerId: 'usr-007',
        managerName: 'Grace Manager',
        startDate: '2023-12-01',
        status: 'PENDING_IT_SETUP',
        slaStatus: 'ON_TRACK',
        createdDate: '2023-10-20',
        completionDate: null,
        documents: [],
        workflow: ['NEW_REQUEST', 'PENDING_HR_REVIEW', 'PENDING_IT_SETUP', 'PENDING_FINANCE', 'APPROVED', 'COMPLETED'],
        currentWorkflowStage: 'PENDING_IT_SETUP',
    },
    {
        id: 'req-005',
        employeeId: null,
        employeeName: 'Senior Product Manager',
        position: 'Product Manager',
        department: 'Product',
        managerId: 'usr-003',
        managerName: 'Charlie Manager',
        startDate: '2024-01-01',
        status: 'PENDING_FINANCE',
        slaStatus: 'AT_RISK',
        createdDate: '2023-10-25',
        completionDate: null,
        documents: [{ name: 'Offer Letter.pdf', url: '#', type: 'PDF' }, { name: 'Compensation Details.xlsx', url: '#', type: 'XLSX' }],
        workflow: ['NEW_REQUEST', 'PENDING_HR_REVIEW', 'PENDING_IT_SETUP', 'PENDING_FINANCE', 'APPROVED', 'COMPLETED'],
        currentWorkflowStage: 'PENDING_FINANCE',
    },
    {
        id: 'req-006',
        employeeId: null,
        employeeName: 'Marketing Intern',
        position: 'Intern',
        department: 'Marketing',
        managerId: 'usr-007',
        managerName: 'Grace Manager',
        startDate: '2023-11-15',
        status: 'REJECTED',
        slaStatus: 'BREACHED',
        createdDate: '2023-10-01',
        completionDate: '2023-10-15',
        documents: [{ name: 'Offer Letter.pdf', url: '#', type: 'PDF' }],
        workflow: ['NEW_REQUEST', 'PENDING_HR_REVIEW', 'REJECTED'],
        currentWorkflowStage: 'REJECTED',
    },
    {
        id: 'req-007',
        employeeId: null,
        employeeName: 'New IT Support',
        position: 'IT Support',
        department: 'IT',
        managerId: 'usr-004',
        managerName: 'Diana IT',
        startDate: '2023-12-10',
        status: 'NEW_REQUEST',
        slaStatus: 'ON_TRACK',
        createdDate: '2023-11-01',
        completionDate: null,
        documents: [],
        workflow: ['NEW_REQUEST', 'PENDING_HR_REVIEW', 'PENDING_IT_SETUP', 'PENDING_FINANCE', 'APPROVED', 'COMPLETED'],
        currentWorkflowStage: 'NEW_REQUEST',
    },
];

const DUMMY_TASKS = [
    { id: 'tsk-001', requestId: 'req-001', assigneeId: 'usr-002', assigneeRole: ROLES.HR_TEAM, description: 'Collect signed offer letter', dueDate: '2023-01-05', status: 'TASK_COMPLETED' },
    { id: 'tsk-002', requestId: 'req-001', assigneeId: 'usr-004', assigneeRole: ROLES.IT_TEAM, description: 'Setup laptop and accounts', dueDate: '2023-01-10', status: 'TASK_COMPLETED' },
    { id: 'tsk-003', requestId: 'req-001', assigneeId: 'usr-005', assigneeRole: ROLES.EMPLOYEE, description: 'Complete HR onboarding forms', dueDate: '2023-01-20', status: 'TASK_COMPLETED' },
    { id: 'tsk-004', requestId: 'req-002', assigneeId: 'usr-002', assigneeRole: ROLES.HR_TEAM, description: 'Verify background check', dueDate: '2023-02-15', status: 'TASK_COMPLETED' },
    { id: 'tsk-005', requestId: 'req-002', assigneeId: 'usr-004', assigneeRole: ROLES.IT_TEAM, description: 'Configure email and network access', dueDate: '2023-02-20', status: 'IN_PROGRESS' },
    { id: 'tsk-006', requestId: 'req-003', assigneeId: 'usr-002', assigneeRole: ROLES.HR_TEAM, description: 'Initial HR review and approval', dueDate: '2023-10-15', status: 'OPEN' },
    { id: 'tsk-007', requestId: 'req-003', assigneeId: 'usr-003', assigneeRole: ROLES.HIRING_MANAGER, description: 'Approve new hire request', dueDate: '2023-10-12', status: 'OVERDUE' },
    { id: 'tsk-008', requestId: 'req-004', assigneeId: 'usr-004', assigneeRole: ROLES.IT_TEAM, description: 'Order new equipment for analyst', dueDate: '2023-11-01', status: 'IN_PROGRESS' },
    { id: 'tsk-009', requestId: 'req-005', assigneeId: 'usr-002', assigneeRole: ROLES.HR_TEAM, description: 'Finalize compensation package', dueDate: '2023-11-05', status: 'OPEN' },
    { id: 'tsk-010', requestId: 'req-007', assigneeId: 'usr-002', assigneeRole: ROLES.HR_TEAM, description: 'Create HR record for new IT Support', dueDate: '2023-11-05', status: 'OPEN' },
];

const DUMMY_AUDIT_LOGS = [
    { id: generateId(), entity: 'Onboarding Request', entityId: 'req-003', action: 'Created', user: 'Bob HR', timestamp: '2023-10-10T10:00:00Z', details: 'New Dev Lead request initiated.' },
    { id: generateId(), entity: 'Onboarding Request', entityId: 'req-003', action: 'Status Update', user: 'Bob HR', timestamp: '2023-10-10T10:15:00Z', details: 'Status changed to Pending HR Review.' },
    { id: generateId(), entity: 'Task', entityId: 'tsk-007', action: 'Overdue', user: 'System', timestamp: '2023-10-13T00:00:00Z', details: 'Task "Approve new hire request" for req-003 is overdue.' },
    { id: generateId(), entity: 'Onboarding Request', entityId: 'req-006', action: 'Rejected', user: 'Bob HR', timestamp: '2023-10-15T14:30:00Z', details: 'Marketing Intern request rejected due to budget.' },
    { id: generateId(), entity: 'Onboarding Request', entityId: 'req-004', action: 'Status Update', user: 'Bob HR', timestamp: '2023-10-21T09:00:00Z', details: 'Status changed to Pending IT Setup.' },
    { id: generateId(), entity: 'Task', entityId: 'tsk-008', action: 'Status Update', user: 'Diana IT', timestamp: '2023-10-22T11:00:00Z', details: 'Task "Order new equipment" for req-004 is In Progress.' },
];

const DUMMY_NOTIFICATIONS = [
    { id: generateId(), userId: 'usr-002', message: 'New onboarding request for Dev Lead requires your review.', read: false, timestamp: '2023-10-10T10:01:00Z' },
    { id: generateId(), userId: 'usr-003', message: 'Task "Approve new hire request" for Dev Lead is overdue.', read: false, timestamp: '2023-10-13T08:00:00Z' },
    { id: generateId(), userId: 'usr-004', message: 'Onboarding request for Junior Data Analyst is pending IT setup.', read: true, timestamp: '2023-10-21T09:05:00Z' },
    { id: generateId(), userId: 'usr-005', message: 'Welcome to the team! Your onboarding is complete.', read: true, timestamp: '2023-01-20T10:00:00Z' },
];

function App() {
    const [view, setView] = useState({ screen: 'LOGIN', params: {} });
    const [currentUser, setCurrentUser] = useState(null); // { id, name, email, role }
    const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
    const [globalSearchTerm, setGlobalSearchTerm] = useState('');
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    // Dummy user login
    const handleLogin = (user) => {
        setCurrentUser(user);
        setView({ screen: 'DASHBOARD', params: {} });
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setView({ screen: 'LOGIN', params: {} });
    };

    const navigate = (screen, params = {}) => {
        setView({ screen, params });
        setIsGlobalSearchOpen(false); // Close search on navigation
        setIsFilterPanelOpen(false); // Close filters on navigation
    };

    const getBreadcrumbs = () => {
        const path = [{ label: 'Home', screen: 'DASHBOARD' }];
        if (view.screen === 'ONBOARDING_REQUESTS') {
            path.push({ label: 'Onboarding Requests', screen: 'ONBOARDING_REQUESTS' });
        } else if (view.screen === 'ONBOARDING_REQUEST_DETAIL') {
            path.push({ label: 'Onboarding Requests', screen: 'ONBOARDING_REQUESTS' });
            const req = DUMMY_ONBOARDING_REQUESTS.find(r => r.id === view.params.requestId);
            path.push({ label: req?.employeeName || 'Detail', screen: 'ONBOARDING_REQUEST_DETAIL', params: view.params });
        } else if (view.screen === 'EMPLOYEE_MANAGEMENT') {
            path.push({ label: 'Employee Management', screen: 'EMPLOYEE_MANAGEMENT' });
        } else if (view.screen === 'EMPLOYEE_DETAIL') {
            path.push({ label: 'Employee Management', screen: 'EMPLOYEE_MANAGEMENT' });
            const emp = DUMMY_EMPLOYEES.find(e => e.id === view.params.employeeId);
            path.push({ label: emp?.name || 'Detail', screen: 'EMPLOYEE_DETAIL', params: view.params });
        } else if (view.screen === 'USER_MANAGEMENT') {
            path.push({ label: 'User Management', screen: 'USER_MANAGEMENT' });
        } else if (view.screen === 'MY_ONBOARDING') {
            path.push({ label: 'My Onboarding', screen: 'MY_ONBOARDING' });
        } else if (view.screen === 'MY_TASKS') {
            path.push({ label: 'My Tasks', screen: 'MY_TASKS' });
        } else if (view.screen === 'AUDIT_LOGS') {
            path.push({ label: 'Audit Logs', screen: 'AUDIT_LOGS' });
        } else if (view.screen === 'SETTINGS') {
            path.push({ label: 'Settings', screen: 'SETTINGS' });
        }
        return path;
    };

    const canAccess = (requiredRoles) => {
        if (!currentUser) return false;
        return requiredRoles.includes(currentUser.role);
    };

    // Global Search Functionality
    const handleGlobalSearchChange = (e) => {
        setGlobalSearchTerm(e.target.value);
    };

    const handleGlobalSearchSubmit = (e) => {
        e.preventDefault();
        if (globalSearchTerm.trim()) {
            // In a real app, this would trigger a global search API call and navigate to a search results page
            console.log('Global search for:', globalSearchTerm);
            // For this single-file app, we can just show a debug message or navigate to a simplified search result screen
            setView({ screen: 'SEARCH_RESULTS', params: { query: globalSearchTerm } });
            setIsGlobalSearchOpen(false);
            setGlobalSearchTerm('');
        }
    };

    // Dummy Form submission handler
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Form submitted! (dummy action)');
    };

    // Helper for rendering status labels
    const renderStatusLabel = (statusKey) => {
        const statusInfo = STATUS_MAP[statusKey];
        if (!statusInfo) return statusKey;
        return (
            <span className={`card-status ${statusInfo.color}`}>
                {statusInfo.icon} {statusInfo.label}
            </span>
        );
    };

    // --- Screen Components ---

    const LoginScreen = () => (
        <div className="container" style={{ textAlign: 'center', marginTop: 'var(--spacing-xxl)' }}>
            <h2>Login</h2>
            <p>Select a user to simulate login:</p>
            <div className="flex-container flex-wrap justify-center mb-lg">
                {DUMMY_USERS.map(user => (
                    <button
                        key={user.id}
                        className="button secondary"
                        onClick={() => handleLogin(user)}
                        style={{ margin: 'var(--spacing-xs)' }}
                    >
                        Login as {user.name} ({user.role})
                    </button>
                ))}
            </div>
        </div>
    );

    const DashboardScreen = () => {
        const totalRequests = DUMMY_ONBOARDING_REQUESTS.length;
        const completedRequests = DUMMY_ONBOARDING_REQUESTS.filter(r => r.status === 'COMPLETED').length;
        const pendingRequests = DUMMY_ONBOARDING_REQUESTS.filter(r => r.status.startsWith('PENDING') || r.status === 'NEW_REQUEST').length;
        const overdueTasks = DUMMY_TASKS.filter(t => t.status === 'OVERDUE').length;

        const recentActivities = DUMMY_AUDIT_LOGS
            .slice() // Create a shallow copy
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 5);

        const currentUsersOnboarding = currentUser?.role === ROLES.EMPLOYEE
            ? DUMMY_ONBOARDING_REQUESTS.find(req => req.employeeId === DUMMY_EMPLOYEES.find(emp => emp.userId === currentUser.id)?.id)
            : null;

        return (
            <div className="container">
                <div className="screen-header">
                    <h2>Dashboard</h2>
                </div>

                <div className="card-grid mb-lg">
                    <div className="kpi-card">
                        <div className="kpi-value live-update">{totalRequests}</div>
                        <div className="kpi-label">Total Onboarding Requests</div>
                    </div>
                    <div className="kpi-card">
                        <div className="kpi-value live-update">{completedRequests}</div>
                        <div className="kpi-label">Completed This Quarter</div>
                    </div>
                    <div className="kpi-card">
                        <div className="kpi-value live-update">{pendingRequests}</div>
                        <div className="kpi-label">Pending Actions</div>
                    </div>
                    <div className="kpi-card">
                        <div className="kpi-value live-update">{overdueTasks}</div>
                        <div className="kpi-label">Overdue Tasks</div>
                    </div>
                </div>

                <div className="flex-container flex-wrap">
                    <div style={{ flex: 2, minWidth: '300px' }}>
                        <h3>Onboarding Overview</h3>
                        <div className="card-grid">
                            <div className="chart-container">
                                <h4>Onboarding Status Distribution (Donut Chart)</h4>
                                <div className="chart-placeholder">Donut Chart Placeholder</div>
                            </div>
                            <div className="chart-container">
                                <h4>Requests by Department (Bar Chart)</h4>
                                <div className="chart-placeholder">Bar Chart Placeholder</div>
                            </div>
                            <div className="chart-container">
                                <h4>SLA Performance (Gauge Chart)</h4>
                                <div className="chart-placeholder">Gauge Chart Placeholder</div>
                            </div>
                            <div className="chart-container">
                                <h4>Historical Onboarding (Line Chart)</h4>
                                <div className="chart-placeholder">Line Chart Placeholder</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '280px', maxWidth: '400px' }}>
                        <h3>Recent Activities</h3>
                        <div className="detail-section">
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {recentActivities.map(log => (
                                    <li key={log.id} className="mb-sm" style={{ borderBottom: '1px dotted var(--color-border)', paddingBottom: 'var(--spacing-xs)' }}>
                                        <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                            <strong>{log.user}</strong> {log.action} for <em>{log.entity} {log.entityId}</em>
                                        </p>
                                        <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                            {log.details} - {new Date(log.timestamp).toLocaleString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {currentUser?.role === ROLES.EMPLOYEE && currentUsersOnboarding && (
                            <>
                                <h3>My Current Onboarding</h3>
                                <div className="card" onClick={() => navigate('MY_ONBOARDING')}
                                     className={`card status-${currentUsersOnboarding?.slaStatus?.toLowerCase()}`}>
                                    <h4 className="card-title">{currentUsersOnboarding.employeeName} - {currentUsersOnboarding.position}</h4>
                                    <p className="card-meta">Start Date: {currentUsersOnboarding.startDate}</p>
                                    <p className="card-meta">Status: {renderStatusLabel(currentUsersOnboarding.status)}</p>
                                    <p className="card-meta">SLA: {renderStatusLabel(currentUsersOnboarding.slaStatus)}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const OnboardingRequestsListScreen = () => {
        const [searchTerm, setSearchTerm] = useState('');
        const [filters, setFilters] = useState({ status: '', department: '', managerId: '' });
        const [sortOrder, setSortOrder] = useState({ key: 'createdDate', direction: 'desc' });

        const filteredRequests = DUMMY_ONBOARDING_REQUESTS
            .filter(req =>
                (req.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 req.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 req.id?.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (filters.status === '' || req.status === filters.status) &&
                (filters.department === '' || req.department === filters.department) &&
                (filters.managerId === '' || req.managerId === filters.managerId)
            )
            .sort((a, b) => {
                const aVal = a[sortOrder.key];
                const bVal = b[sortOrder.key];
                if (aVal < bVal) return sortOrder.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortOrder.direction === 'asc' ? 1 : -1;
                return 0;
            });

        const handleFilterChange = (key, value) => {
            setFilters(prev => ({ ...prev, [key]: value }));
        };

        const handleSort = (key) => {
            setSortOrder(prev => ({
                key,
                direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
            }));
        };

        return (
            <div className="container">
                <div className="screen-header">
                    <h2>Onboarding Requests</h2>
                    <div>
                        <button className="button" onClick={() => navigate('NEW_ONBOARDING_REQUEST')}>+ New Request</button>
                        <button className="button secondary" onClick={() => setIsFilterPanelOpen(true)}>Filter</button>
                        <button className="button secondary">Export</button>
                    </div>
                </div>

                <div style={{ marginBottom: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <input
                        type="text"
                        placeholder="Search requests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flexGrow: 1 }}
                    />
                    <button className="button secondary" onClick={() => alert('Bulk Action: Approve Selected')}>Bulk Approve</button>
                </div>

                <div className="card-grid">
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map(req => (
                            <div
                                key={req.id}
                                className={`card status-${req.status?.toLowerCase()}`}
                                onClick={() => navigate('ONBOARDING_REQUEST_DETAIL', { requestId: req.id })}
                            >
                                <h3 className="card-title">{req.employeeName}</h3>
                                <p className="card-meta">{req.position} ({req.department})</p>
                                <p className="card-meta">Manager: {req.managerName}</p>
                                <p className="card-meta">Start Date: {req.startDate}</p>
                                <div className="flex-container align-center justify-between" style={{marginTop: 'var(--spacing-sm)'}}>
                                    {renderStatusLabel(req.status)}
                                    {renderStatusLabel(req.slaStatus)}
                                </div>
                                <div style={{position: 'absolute', right: 'var(--spacing-md)', top: 'var(--spacing-md)', color: 'var(--color-secondary)'}}>
                                    ID: {req.id}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center" style={{ gridColumn: '1 / -1', padding: 'var(--spacing-xl)', border: '1px dashed var(--color-border)' }}>
                            <p>No onboarding requests found matching your criteria.</p>
                            <button className="button" onClick={() => navigate('NEW_ONBOARDING_REQUEST')}>Create New Request</button>
                        </div>
                    )}
                </div>

                {/* Filter Panel (Web: Side Panel, Mobile: Bottom Sheet) */}
                <div className={`filter-panel ${isFilterPanelOpen ? 'open' : ''}`}>
                    <h4>Filters <button className="close-btn" onClick={() => setIsFilterPanelOpen(false)}>✕</button></h4>
                    <div className="form-group">
                        <label htmlFor="filter-status">Status</label>
                        <select id="filter-status" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                            <option value="">All Statuses</option>
                            {Object.keys(STATUS_MAP).filter(s => s.includes('_REQUEST') || s === 'APPROVED' || s === 'REJECTED' || s === 'COMPLETED').map(statusKey => (
                                <option key={statusKey} value={statusKey}>{STATUS_MAP[statusKey]?.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="filter-department">Department</label>
                        <select id="filter-department" value={filters.department} onChange={(e) => handleFilterChange('department', e.target.value)}>
                            <option value="">All Departments</option>
                            {Array.from(new Set(DUMMY_ONBOARDING_REQUESTS.map(req => req.department))).map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="filter-manager">Manager</label>
                        <select id="filter-manager" value={filters.managerId} onChange={(e) => handleFilterChange('managerId', e.target.value)}>
                            <option value="">All Managers</option>
                            {DUMMY_USERS.filter(u => u.role === ROLES.HIRING_MANAGER).map(mgr => (
                                <option key={mgr.id} value={mgr.id}>{mgr.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-actions">
                        <button className="button secondary" onClick={() => setFilters({ status: '', department: '', managerId: '' })}>Clear Filters</button>
                        <button className="button" onClick={() => setIsFilterPanelOpen(false)}>Apply</button>
                    </div>
                </div>
                <div className={`overlay ${isFilterPanelOpen ? 'open' : ''}`} onClick={() => setIsFilterPanelOpen(false)}></div>
            </div>
        );
    };

    const OnboardingRequestDetailScreen = () => {
        const { requestId } = view.params;
        const request = DUMMY_ONBOARDING_REQUESTS.find(r => r.id === requestId);
        const relatedTasks = DUMMY_TASKS.filter(t => t.requestId === requestId);
        const relatedAuditLogs = DUMMY_AUDIT_LOGS.filter(log => log.entityId === requestId);

        if (!request) {
            return (
                <div className="container text-center">
                    <p>Onboarding request not found.</p>
                    <button className="button" onClick={() => navigate('ONBOARDING_REQUESTS')}>Back to List</button>
                </div>
            );
        }

        const handleApprove = () => {
            // Dummy approval logic: update status
            const updatedRequests = DUMMY_ONBOARDING_REQUESTS.map(r =>
                r.id === requestId ? { ...r, status: 'APPROVED', slaStatus: 'ON_TRACK', currentWorkflowStage: 'APPROVED' } : r
            );
            console.log('Approved request:', requestId, updatedRequests);
            alert(`Request ${requestId} approved! (Dummy action)`);
            // In a real app, you would dispatch an action or update state to reflect this change
            navigate('ONBOARDING_REQUESTS');
        };

        const handleReject = () => {
            // Dummy rejection logic
            const updatedRequests = DUMMY_ONBOARDING_REQUESTS.map(r =>
                r.id === requestId ? { ...r, status: 'REJECTED', slaStatus: 'BREACHED', currentWorkflowStage: 'REJECTED' } : r
            );
            console.log('Rejected request:', requestId, updatedRequests);
            alert(`Request ${requestId} rejected! (Dummy action)`);
            navigate('ONBOARDING_REQUESTS');
        };

        const handleEdit = () => {
            alert('Edit functionality not implemented for this demo.');
            // navigate('EDIT_ONBOARDING_REQUEST', { requestId: request.id });
        };

        const handleCompleteTask = (taskId) => {
            const updatedTasks = DUMMY_TASKS.map(task =>
                (task.id === taskId)
                    ? { ...task, status: 'TASK_COMPLETED' }
                    : task
            );
            console.log('Task completed:', taskId, updatedTasks);
            alert(`Task ${taskId} completed! (Dummy action)`);
            // In a real app, update global tasks state
        };

        return (
            <div className="container">
                <div className="screen-header">
                    <div className="breadcrumbs">
                        {getBreadcrumbs().map((crumb, index, arr) => (
                            <React.Fragment key={crumb.screen}>
                                <a onClick={() => navigate(crumb.screen, crumb.params)}>{crumb.label}</a>
                                {index < arr.length - 1 && <span> / </span>}
                            </React.Fragment>
                        ))}
                    </div>
                    {canAccess([ROLES.HR_TEAM, ROLES.ADMIN]) && (
                        <div>
                            {request.status !== 'COMPLETED' && request.status !== 'REJECTED' && (
                                <>
                                    <button className="button secondary" onClick={handleEdit} style={{marginRight: 'var(--spacing-sm)'}}>Edit</button>
                                    {(request.status === 'PENDING_HR_REVIEW') && (
                                        <>
                                            <button className="button" onClick={handleApprove} style={{marginRight: 'var(--spacing-sm)'}}>Approve</button>
                                            <button className="button danger" onClick={handleReject}>Reject</button>
                                        </>
                                    )}
                                </>
                            )}
                            {(request.status === 'COMPLETED' || request.status === 'REJECTED') && (
                                <button className="button secondary" onClick={() => alert('View Archive (dummy)')}>View Archive</button>
                            )}
                        </div>
                    )}
                </div>

                <h2>Onboarding Request: {request.employeeName}</h2>
                <p className="mb-lg" style={{ color: 'var(--color-text-secondary)' }}>ID: {request.id}</p>

                <div className="workflow-tracker">
                    {request.workflow?.map((stage, index) => (
                        <div
                            key={stage}
                            className={`workflow-step ${request.workflow.indexOf(request.currentWorkflowStage) >= index ? 'completed' : ''} ${request.currentWorkflowStage === stage ? 'active' : ''}`}
                        >
                            <div className="workflow-step-indicator">{index + 1}</div>
                            <div className="workflow-step-label">{STATUS_MAP[stage]?.label || stage}</div>
                        </div>
                    ))}
                </div>

                <div className="flex-container flex-wrap" style={{ alignItems: 'flex-start' }}>
                    <div style={{ flex: 2, minWidth: '300px' }}>
                        <div className="detail-section">
                            <h4>Request Details</h4>
                            <div className="detail-item"><strong>Employee Name:</strong> <span>{request.employeeName}</span></div>
                            <div className="detail-item"><strong>Position:</strong> <span>{request.position}</span></div>
                            <div className="detail-item"><strong>Department:</strong> <span>{request.department}</span></div>
                            <div className="detail-item"><strong>Manager:</strong> <span>{request.managerName}</span></div>
                            <div className="detail-item"><strong>Start Date:</strong> <span>{request.startDate}</span></div>
                            <div className="detail-item"><strong>Status:</strong> <span>{renderStatusLabel(request.status)}</span></div>
                            <div className="detail-item"><strong>SLA Status:</strong> <span>{renderStatusLabel(request.slaStatus)}</span></div>
                            <div className="detail-item"><strong>Created On:</strong> <span>{new Date(request.createdDate).toLocaleDateString()}</span></div>
                            {request.completionDate && (
                                <div className="detail-item"><strong>Completion Date:</strong> <span>{new Date(request.completionDate).toLocaleDateString()}</span></div>
                            )}
                        </div>

                        <div className="detail-section">
                            <h4>Tasks ({relatedTasks.filter(t => t.status !== 'TASK_COMPLETED').length} pending)</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {relatedTasks.length > 0 ? (
                                    relatedTasks.map(task => (
                                        <li key={task.id} className="card status-on-track" style={{ marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', cursor: 'default' }}>
                                            <div style={{ flexGrow: 1 }}>
                                                <h5 className="card-title" style={{ marginBottom: 'var(--spacing-xxs)' }}>{task.description}</h5>
                                                <p className="card-meta">Assigned to: {task.assigneeRole} ({DUMMY_USERS.find(u => u.id === task.assigneeId)?.name}) | Due: {task.dueDate}</p>
                                            </div>
                                            {renderStatusLabel(task.status)}
                                            {canAccess([ROLES.HR_TEAM, ROLES.IT_TEAM, ROLES.ADMIN]) && task.status !== 'TASK_COMPLETED' && (
                                                <button className="button" onClick={() => handleCompleteTask(task.id)}>Mark Complete</button>
                                            )}
                                        </li>
                                    ))
                                ) : (
                                    <p>No tasks found for this request.</p>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '280px', maxWidth: '400px' }}>
                        <div className="detail-section">
                            <h4>Documents</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {request.documents?.length > 0 ? (
                                    request.documents.map((doc, index) => (
                                        <li key={index} className="mb-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dotted var(--color-border)', paddingBottom: 'var(--spacing-xs)' }}>
                                            <span>📄 {doc.name} ({doc.type})</span>
                                            <button className="button secondary" onClick={() => alert(`Previewing ${doc.name}`)}>Preview</button>
                                        </li>
                                    ))
                                ) : (
                                    <p>No documents uploaded.</p>
                                )}
                            </ul>
                            {canAccess([ROLES.HR_TEAM, ROLES.ADMIN]) && (
                                <button className="button" style={{ marginTop: 'var(--spacing-md)' }} onClick={() => alert('File upload functionality')}>Upload Document</button>
                            )}
                        </div>

                        <div className="detail-section">
                            <h4>Audit Logs</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {relatedAuditLogs.length > 0 ? (
                                    relatedAuditLogs.map(log => (
                                        <li key={log.id} className="mb-sm" style={{ borderBottom: '1px dotted var(--color-border)', paddingBottom: 'var(--spacing-xs)' }}>
                                            <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                                <strong>{log.user}</strong> {log.action}
                                            </p>
                                            <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                                {log.details}
                                            </p>
                                            <span style={{ fontSize: 'var(--font-size-xxs)', color: 'var(--color-secondary)' }}>{new Date(log.timestamp).toLocaleString()}</span>
                                        </li>
                                    ))
                                ) : (
                                    <p>No audit logs for this request.</p>
                                )}
                            </ul>
                            {canAccess([ROLES.ADMIN, ROLES.HR_TEAM]) && (
                                <button className="button secondary" style={{ marginTop: 'var(--spacing-md)' }} onClick={() => navigate('AUDIT_LOGS')}>View All Logs</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const EmployeeManagementListScreen = () => {
        const [searchTerm, setSearchTerm] = useState('');
        const [filters, setFilters] = useState({ status: '', department: '' });
        const [sortOrder, setSortOrder] = useState({ key: 'name', direction: 'asc' });

        const filteredEmployees = DUMMY_EMPLOYEES
            .filter(emp =>
                (emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 emp.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 emp.department?.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (filters.status === '' || emp.status === filters.status) &&
                (filters.department === '' || emp.department === filters.department)
            )
            .sort((a, b) => {
                const aVal = a[sortOrder.key];
                const bVal = b[sortOrder.key];
                if (aVal < bVal) return sortOrder.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortOrder.direction === 'asc' ? 1 : -1;
                return 0;
            });

        const handleFilterChange = (key, value) => {
            setFilters(prev => ({ ...prev, [key]: value }));
        };

        const handleSort = (key) => {
            setSortOrder(prev => ({
                key,
                direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
            }));
        };

        return (
            <div className="container">
                <div className="screen-header">
                    <h2>Employee Management</h2>
                    {canAccess([ROLES.HR_TEAM, ROLES.ADMIN]) && (
                        <div>
                            <button className="button">+ Add Employee</button>
                            <button className="button secondary">Export</button>
                        </div>
                    )}
                </div>
                <div style={{ marginBottom: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flexGrow: 1 }}
                    />
                    <button className="button secondary" onClick={() => setIsFilterPanelOpen(true)}>Filter</button>
                </div>

                <div className="card-grid">
                    {filteredEmployees.length > 0 ? (
                        filteredEmployees.map(employee => (
                            <div
                                key={employee.id}
                                className={`card status-${employee.status?.split(' ').join('-').toLowerCase()}`}
                                onClick={() => navigate('EMPLOYEE_DETAIL', { employeeId: employee.id })}
                            >
                                <h3 className="card-title">{employee.name}</h3>
                                <p className="card-meta">{employee.role} ({employee.department})</p>
                                <p className="card-meta">Manager: {employee.managerName}</p>
                                <p className="card-meta">Start Date: {employee.startDate}</p>
                                <div className="flex-container align-center justify-between" style={{marginTop: 'var(--spacing-sm)'}}>
                                    {renderStatusLabel(Object.keys(STATUS_MAP).find(key => STATUS_MAP[key].label === employee.status) || employee.status)}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center" style={{ gridColumn: '1 / -1', padding: 'var(--spacing-xl)', border: '1px dashed var(--color-border)' }}>
                            <p>No employees found matching your criteria.</p>
                            {canAccess([ROLES.HR_TEAM, ROLES.ADMIN]) && <button className="button">Add New Employee</button>}
                        </div>
                    )}
                </div>

                {/* Filter Panel */}
                <div className={`filter-panel ${isFilterPanelOpen ? 'open' : ''}`}>
                    <h4>Employee Filters <button className="close-btn" onClick={() => setIsFilterPanelOpen(false)}>✕</button></h4>
                    <div className="form-group">
                        <label htmlFor="filter-emp-status">Status</label>
                        <select id="filter-emp-status" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                            <option value="">All Statuses</option>
                            {Object.values(STATUS_MAP).filter(s => s.label === 'Active' || s.label === 'On Leave' || s.label === 'Terminated').map(status => (
                                <option key={status.label} value={status.label}>{status.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="filter-emp-department">Department</label>
                        <select id="filter-emp-department" value={filters.department} onChange={(e) => handleFilterChange('department', e.target.value)}>
                            <option value="">All Departments</option>
                            {Array.from(new Set(DUMMY_EMPLOYEES.map(emp => emp.department))).map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-actions">
                        <button className="button secondary" onClick={() => setFilters({ status: '', department: '' })}>Clear Filters</button>
                        <button className="button" onClick={() => setIsFilterPanelOpen(false)}>Apply</button>
                    </div>
                </div>
                <div className={`overlay ${isFilterPanelOpen ? 'open' : ''}`} onClick={() => setIsFilterPanelOpen(false)}></div>
            </div>
        );
    };

    const EmployeeDetailScreen = () => {
        const { employeeId } = view.params;
        const employee = DUMMY_EMPLOYEES.find(e => e.id === employeeId);
        const employeeOnboardingRequests = DUMMY_ONBOARDING_REQUESTS.filter(req => req.employeeId === employeeId);
        const employeeTasks = DUMMY_TASKS.filter(task => task.assigneeId === employee?.userId); // Assuming tasks are assigned to user ID

        if (!employee) {
            return <div className="container text-center"><p>Employee not found.</p><button className="button" onClick={() => navigate('EMPLOYEE_MANAGEMENT')}>Back to List</button></div>;
        }

        const currentEmployeeStatus = Object.keys(STATUS_MAP).find(key => STATUS_MAP[key].label === employee.status) || employee.status;

        return (
            <div className="container">
                <div className="screen-header">
                    <div className="breadcrumbs">
                        {getBreadcrumbs().map((crumb, index, arr) => (
                            <React.Fragment key={crumb.screen}>
                                <a onClick={() => navigate(crumb.screen, crumb.params)}>{crumb.label}</a>
                                {index < arr.length - 1 && <span> / </span>}
                            </React.Fragment>
                        ))}
                    </div>
                    {canAccess([ROLES.HR_TEAM, ROLES.ADMIN]) && (
                        <div>
                            <button className="button secondary" onClick={() => alert('Edit Employee (dummy)')}>Edit</button>
                            <button className="button danger" onClick={() => alert('Terminate Employee (dummy)')} style={{marginLeft: 'var(--spacing-sm)'}}>Terminate</button>
                        </div>
                    )}
                </div>
                <h2>Employee: {employee.name}</h2>
                <p className="mb-lg" style={{ color: 'var(--color-text-secondary)' }}>ID: {employee.id}</p>

                <div className="flex-container flex-wrap" style={{ alignItems: 'flex-start' }}>
                    <div style={{ flex: 2, minWidth: '300px' }}>
                        <div className="detail-section">
                            <h4>Personal & Employment Details</h4>
                            <div className="detail-item"><strong>Email:</strong> <span>{employee.email}</span></div>
                            <div className="detail-item"><strong>Role:</strong> <span>{employee.role}</span></div>
                            <div className="detail-item"><strong>Department:</strong> <span>{employee.department}</span></div>
                            <div className="detail-item"><strong>Manager:</strong> <span>{employee.managerName}</span></div>
                            <div className="detail-item"><strong>Start Date:</strong> <span>{employee.startDate}</span></div>
                            {employee.endDate && <div className="detail-item"><strong>End Date:</strong> <span>{employee.endDate}</span></div>}
                            <div className="detail-item"><strong>Status:</strong> <span>{renderStatusLabel(currentEmployeeStatus)}</span></div>
                        </div>

                        <div className="detail-section">
                            <h4>Onboarding History</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {employeeOnboardingRequests.length > 0 ? (
                                    employeeOnboardingRequests.map(req => (
                                        <li
                                            key={req.id}
                                            className={`card status-${req.status?.toLowerCase()}`}
                                            onClick={() => navigate('ONBOARDING_REQUEST_DETAIL', { requestId: req.id })}
                                            style={{ marginBottom: 'var(--spacing-sm)' }}
                                        >
                                            <h5 className="card-title" style={{ marginBottom: 'var(--spacing-xxs)' }}>{req.position} Request</h5>
                                            <p className="card-meta">Start Date: {req.startDate}</p>
                                            <div className="flex-container align-center justify-between" style={{marginTop: 'var(--spacing-sm)'}}>
                                                {renderStatusLabel(req.status)}
                                                {renderStatusLabel(req.slaStatus)}
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <p>No onboarding requests found for this employee.</p>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '280px', maxWidth: '400px' }}>
                        <div className="detail-section">
                            <h4>Assigned Tasks</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {employeeTasks.length > 0 ? (
                                    employeeTasks.map(task => (
                                        <li
                                            key={task.id}
                                            className="card"
                                            onClick={() => navigate('ONBOARDING_REQUEST_DETAIL', { requestId: task.requestId })} // Navigate to related request
                                            style={{ marginBottom: 'var(--spacing-sm)', borderLeft: '5px solid var(--color-border-dark)' }}
                                        >
                                            <h5 className="card-title">{task.description}</h5>
                                            <p className="card-meta">Due: {task.dueDate}</p>
                                            <div style={{ marginTop: 'var(--spacing-xs)' }}>
                                                {renderStatusLabel(task.status)}
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <p>No tasks assigned to this employee (user).</p>
                                )}
                            </ul>
                        </div>
                        <div className="detail-section">
                            <h4>Document Library</h4>
                            <p>Files related to {employee.name} would be listed here.</p>
                            <button className="button secondary" onClick={() => alert('View Document Library (dummy)')}>View All Docs</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const MyOnboardingScreen = () => {
        const employee = DUMMY_EMPLOYEES.find(emp => emp.userId === currentUser?.id);
        const currentOnboardingRequest = employee
            ? DUMMY_ONBOARDING_REQUESTS.find(req => req.employeeId === employee.id && req.status !== 'COMPLETED' && req.status !== 'ARCHIVED')
            : null;

        if (!employee) {
            return (
                <div className="container text-center">
                    <h2>My Onboarding</h2>
                    <p>Employee record not found. Please contact HR.</p>
                </div>
            );
        }

        if (!currentOnboardingRequest) {
            return (
                <div className="container text-center">
                    <h2>My Onboarding</h2>
                    <p>You currently don't have an active onboarding request.</p>
                    <p>Welcome to the team!</p>
                </div>
            );
        }

        const relatedTasks = DUMMY_TASKS.filter(t => t.requestId === currentOnboardingRequest.id && t.assigneeId === currentUser?.id);

        const handleCompleteTask = (taskId) => {
            alert(`Task ${taskId} marked as complete! (Dummy action)`);
            // In a real app, you'd update the task status in the backend/global state
        };

        return (
            <div className="container">
                <div className="screen-header">
                    <h2>My Onboarding</h2>
                </div>

                <div className="flex-container flex-wrap" style={{ alignItems: 'flex-start' }}>
                    <div style={{ flex: 2, minWidth: '300px' }}>
                        <div className="detail-section">
                            <h4>My Onboarding Progress</h4>
                            <div className="workflow-tracker">
                                {currentOnboardingRequest.workflow?.map((stage, index) => (
                                    <div
                                        key={stage}
                                        className={`workflow-step ${currentOnboardingRequest.workflow.indexOf(currentOnboardingRequest.currentWorkflowStage) >= index ? 'completed' : ''} ${currentOnboardingRequest.currentWorkflowStage === stage ? 'active' : ''}`}
                                    >
                                        <div className="workflow-step-indicator">{index + 1}</div>
                                        <div className="workflow-step-label">{STATUS_MAP[stage]?.label || stage}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="detail-item"><strong>My Position:</strong> <span>{currentOnboardingRequest.position}</span></div>
                            <div className="detail-item"><strong>Department:</strong> <span>{currentOnboardingRequest.department}</span></div>
                            <div className="detail-item"><strong>Manager:</strong> <span>{currentOnboardingRequest.managerName}</span></div>
                            <div className="detail-item"><strong>Start Date:</strong> <span>{currentOnboardingRequest.startDate}</span></div>
                            <div className="detail-item"><strong>Overall Status:</strong> <span>{renderStatusLabel(currentOnboardingRequest.status)}</span></div>
                        </div>

                        <div className="detail-section">
                            <h4>My Pending Tasks</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {relatedTasks.length > 0 ? (
                                    relatedTasks.map(task => (
                                        <li key={task.id} className={`card status-${task.status?.toLowerCase()}`} style={{ marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', cursor: 'default' }}>
                                            <div style={{ flexGrow: 1 }}>
                                                <h5 className="card-title" style={{ marginBottom: 'var(--spacing-xxs)' }}>{task.description}</h5>
                                                <p className="card-meta">Due: {task.dueDate}</p>
                                            </div>
                                            {renderStatusLabel(task.status)}
                                            {task.status !== 'TASK_COMPLETED' && (
                                                <button className="button" onClick={() => handleCompleteTask(task.id)}>Complete</button>
                                            )}
                                        </li>
                                    ))
                                ) : (
                                    <p>No pending tasks assigned to you for this onboarding.</p>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '280px', maxWidth: '400px' }}>
                        <div className="detail-section">
                            <h4>Required Documents</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {currentOnboardingRequest.documents?.length > 0 ? (
                                    currentOnboardingRequest.documents.map((doc, index) => (
                                        <li key={index} className="mb-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dotted var(--color-border)', paddingBottom: 'var(--spacing-xs)' }}>
                                            <span>📄 {doc.name} ({doc.type})</span>
                                            <button className="button secondary" onClick={() => alert(`Previewing ${doc.name}`)}>Preview</button>
                                        </li>
                                    ))
                                ) : (
                                    <p>No documents currently required for your review.</p>
                                )}
                            </ul>
                            <button className="button" style={{ marginTop: 'var(--spacing-md)' }} onClick={() => alert('Upload personal documents (dummy)')}>Upload My Documents</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const MyTasksScreen = () => {
        const myTasks = DUMMY_TASKS.filter(task => task.assigneeId === currentUser?.id);

        const handleCompleteTask = (taskId) => {
            alert(`Task ${taskId} marked as complete! (Dummy action)`);
            // In a real app, you'd update the task status in the backend/global state
        };

        return (
            <div className="container">
                <div className="screen-header">
                    <h2>My Tasks</h2>
                </div>
                <div className="card-grid">
                    {myTasks.length > 0 ? (
                        myTasks.map(task => (
                            <div
                                key={task.id}
                                className={`card status-${task.status?.toLowerCase()}`}
                                onClick={() => navigate('ONBOARDING_REQUEST_DETAIL', { requestId: task.requestId })}
                            >
                                <h3 className="card-title">{task.description}</h3>
                                <p className="card-meta">For Request: {DUMMY_ONBOARDING_REQUESTS.find(req => req.id === task.requestId)?.employeeName || task.requestId}</p>
                                <p className="card-meta">Due Date: {task.dueDate}</p>
                                <div className="flex-container align-center justify-between" style={{marginTop: 'var(--spacing-sm)'}}>
                                    {renderStatusLabel(task.status)}
                                    {task.status !== 'TASK_COMPLETED' && (
                                        <button className="button" onClick={(e) => { e.stopPropagation(); handleCompleteTask(task.id); }}>Complete Task</button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center" style={{ gridColumn: '1 / -1', padding: 'var(--spacing-xl)', border: '1px dashed var(--color-border)' }}>
                            <p>You have no pending tasks.</p>
                            <p>Good job!</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const UserManagementScreen = () => (
        <div className="container">
            <div className="screen-header">
                <h2>User Management</h2>
                {canAccess([ROLES.ADMIN]) && <button className="button">+ Add User</button>}
            </div>
            {canAccess([ROLES.ADMIN]) ? (
                <div className="card-grid">
                    {DUMMY_USERS.map(user => (
                        <div
                            key={user.id}
                            className="card"
                            onClick={() => alert(`View details for user: ${user.name}`)}
                        >
                            <h3 className="card-title">{user.name}</h3>
                            <p className="card-meta">Email: {user.email}</p>
                            <p className="card-meta">Role: {user.role}</p>
                            <div style={{position: 'absolute', right: 'var(--spacing-md)', top: 'var(--spacing-md)', color: 'var(--color-secondary)'}}>
                                ID: {user.id}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center" style={{ padding: 'var(--spacing-xl)', border: '1px dashed var(--color-border)' }}>
                    <p>You do not have permission to view User Management.</p>
                </div>
            )}
        </div>
    );

    const AuditLogsScreen = () => {
        const [searchTerm, setSearchTerm] = useState('');
        const [filters, setFilters] = useState({ entity: '', user: '' });
        const [sortOrder, setSortOrder] = useState({ key: 'timestamp', direction: 'desc' });

        const filteredLogs = DUMMY_AUDIT_LOGS
            .filter(log =>
                (log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 log.user?.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (filters.entity === '' || log.entity === filters.entity) &&
                (filters.user === '' || log.user === filters.user)
            )
            .sort((a, b) => {
                const aVal = new Date(a[sortOrder.key]).getTime();
                const bVal = new Date(b[sortOrder.key]).getTime();
                if (aVal < bVal) return sortOrder.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortOrder.direction === 'asc' ? 1 : -1;
                return 0;
            });

        const handleFilterChange = (key, value) => {
            setFilters(prev => ({ ...prev, [key]: value }));
        };

        const handleSort = (key) => {
            setSortOrder(prev => ({
                key,
                direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
            }));
        };

        return (
            <div className="container">
                <div className="screen-header">
                    <h2>Audit Logs</h2>
                    {canAccess([ROLES.ADMIN, ROLES.HR_TEAM]) && <button className="button secondary">Export Logs</button>}
                </div>
                {canAccess([ROLES.ADMIN, ROLES.HR_TEAM]) ? (
                    <>
                        <div style={{ marginBottom: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-sm)' }}>
                            <input
                                type="text"
                                placeholder="Search logs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ flexGrow: 1 }}
                            />
                            <button className="button secondary" onClick={() => setIsFilterPanelOpen(true)}>Filter</button>
                        </div>
                        <div className="detail-section">
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {filteredLogs.length > 0 ? (
                                    filteredLogs.map(log => (
                                        <li key={log.id} className="mb-sm" style={{ borderBottom: '1px dotted var(--color-border)', paddingBottom: 'var(--spacing-xs)' }}>
                                            <p style={{ margin: 0, fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-medium)' }}>
                                                <strong>{log.user}</strong> {log.action} on {log.entity} ({log.entityId})
                                            </p>
                                            <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                                {log.details}
                                            </p>
                                            <span style={{ fontSize: 'var(--font-size-xxs)', color: 'var(--color-secondary)' }}>{new Date(log.timestamp).toLocaleString()}</span>
                                        </li>
                                    ))
                                ) : (
                                    <p>No audit logs found matching your criteria.</p>
                                )}
                            </ul>
                        </div>

                        {/* Filter Panel */}
                        <div className={`filter-panel ${isFilterPanelOpen ? 'open' : ''}`}>
                            <h4>Audit Filters <button className="close-btn" onClick={() => setIsFilterPanelOpen(false)}>✕</button></h4>
                            <div className="form-group">
                                <label htmlFor="filter-log-entity">Entity Type</label>
                                <select id="filter-log-entity" value={filters.entity} onChange={(e) => handleFilterChange('entity', e.target.value)}>
                                    <option value="">All Entities</option>
                                    {Array.from(new Set(DUMMY_AUDIT_LOGS.map(log => log.entity))).map(entity => (
                                        <option key={entity} value={entity}>{entity}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="filter-log-user">User</label>
                                <select id="filter-log-user" value={filters.user} onChange={(e) => handleFilterChange('user', e.target.value)}>
                                    <option value="">All Users</option>
                                    {Array.from(new Set(DUMMY_AUDIT_LOGS.map(log => log.user))).map(user => (
                                        <option key={user} value={user}>{user}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-actions">
                                <button className="button secondary" onClick={() => setFilters({ entity: '', user: '' })}>Clear Filters</button>
                                <button className="button" onClick={() => setIsFilterPanelOpen(false)}>Apply</button>
                            </div>
                        </div>
                        <div className={`overlay ${isFilterPanelOpen ? 'open' : ''}`} onClick={() => setIsFilterPanelOpen(false)}></div>
                    </>
                ) : (
                    <div className="text-center" style={{ padding: 'var(--spacing-xl)', border: '1px dashed var(--color-border)' }}>
                        <p>You do not have permission to view Audit Logs.</p>
                    </div>
                )}
            </div>
        );
    };

    const SettingsScreen = () => (
        <div className="container">
            <div className="screen-header">
                <h2>Settings</h2>
            </div>
            <div className="detail-section">
                <h4>User Preferences</h4>
                <div className="form-group">
                    <label htmlFor="theme">Theme</label>
                    <select id="theme">
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="notifications">Notifications</label>
                    <input type="checkbox" id="notifications" defaultChecked />
                    <label htmlFor="notifications" style={{ display: 'inline', marginLeft: 'var(--spacing-xs)' }}>Enable Email Notifications</label>
                </div>
                <div className="form-actions">
                    <button className="button" onClick={handleSubmit}>Save Preferences</button>
                </div>
            </div>
            {canAccess([ROLES.ADMIN]) && (
                <div className="detail-section" style={{ marginTop: 'var(--spacing-md)' }}>
                    <h4>Admin Settings</h4>
                    <div className="form-group">
                        <label htmlFor="sla-config">SLA Configuration</label>
                        <textarea id="sla-config" defaultValue="Define SLA rules here..." />
                    </div>
                    <div className="form-actions">
                        <button className="button" onClick={handleSubmit}>Update SLA</button>
                    </div>
                </div>
            )}
        </div>
    );

    const NewOnboardingRequestScreen = () => {
        const [newRequest, setNewRequest] = useState({
            employeeName: '',
            position: '',
            department: '',
            managerId: '',
            startDate: '',
            documents: []
        });
        const [errors, setErrors] = useState({});

        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setNewRequest(prev => ({ ...prev, [name]: value }));
        };

        const handleFileChange = (e) => {
            const files = Array.from(e.target.files).map(file => ({
                name: file.name,
                url: '#', // Placeholder URL
                type: file.type.split('/')[1]?.toUpperCase() || 'FILE'
            }));
            setNewRequest(prev => ({ ...prev, documents: [...prev.documents, ...files] }));
        };

        const validateForm = () => {
            let formErrors = {};
            if (!newRequest.employeeName) formErrors.employeeName = 'Employee Name is mandatory';
            if (!newRequest.position) formErrors.position = 'Position is mandatory';
            if (!newRequest.department) formErrors.department = 'Department is mandatory';
            if (!newRequest.managerId) formErrors.managerId = 'Manager is mandatory';
            if (!newRequest.startDate) formErrors.startDate = 'Start Date is mandatory';
            setErrors(formErrors);
            return Object.keys(formErrors).length === 0;
        };

        const handleCreateRequest = (e) => {
            e.preventDefault();
            if (validateForm()) {
                const manager = DUMMY_USERS.find(u => u.id === newRequest.managerId);
                const newReqId = `req-${generateId()}`;
                const newReq = {
                    id: newReqId,
                    employeeId: null, // Will be assigned after onboarding
                    employeeName: newRequest.employeeName,
                    position: newRequest.position,
                    department: newRequest.department,
                    managerId: newRequest.managerId,
                    managerName: manager?.name,
                    startDate: newRequest.startDate,
                    status: 'NEW_REQUEST',
                    slaStatus: 'ON_TRACK',
                    createdDate: new Date().toISOString(),
                    completionDate: null,
                    documents: newRequest.documents,
                    workflow: ['NEW_REQUEST', 'PENDING_HR_REVIEW', 'PENDING_IT_SETUP', 'PENDING_FINANCE', 'APPROVED', 'COMPLETED'],
                    currentWorkflowStage: 'NEW_REQUEST',
                };
                DUMMY_ONBOARDING_REQUESTS.push(newReq); // Directly mutate for demo, but use immutable update in real app
                alert('New Onboarding Request Created! (Dummy)');
                navigate('ONBOARDING_REQUEST_DETAIL', { requestId: newReqId });
            }
        };

        return (
            <div className="container">
                <div className="screen-header">
                    <h2>Create New Onboarding Request</h2>
                </div>
                <div className="detail-section">
                    <form onSubmit={handleCreateRequest}>
                        <div className="form-group">
                            <label htmlFor="employeeName">Employee Name <span style={{color: 'var(--color-danger)'}}>*</span></label>
                            <input
                                type="text"
                                id="employeeName"
                                name="employeeName"
                                value={newRequest.employeeName}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.employeeName && <p className="error-message">{errors.employeeName}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="position">Position <span style={{color: 'var(--color-danger)'}}>*</span></label>
                            <input
                                type="text"
                                id="position"
                                name="position"
                                value={newRequest.position}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.position && <p className="error-message">{errors.position}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="department">Department <span style={{color: 'var(--color-danger)'}}>*</span></label>
                            <input
                                type="text"
                                id="department"
                                name="department"
                                value={newRequest.department}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.department && <p className="error-message">{errors.department}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="managerId">Hiring Manager <span style={{color: 'var(--color-danger)'}}>*</span></label>
                            <select
                                id="managerId"
                                name="managerId"
                                value={newRequest.managerId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Manager</option>
                                {DUMMY_USERS.filter(u => u.role === ROLES.HIRING_MANAGER).map(mgr => (
                                    <option key={mgr.id} value={mgr.id}>{mgr.name}</option>
                                ))}
                            </select>
                            {errors.managerId && <p className="error-message">{errors.managerId}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="startDate">Start Date <span style={{color: 'var(--color-danger)'}}>*</span></label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={newRequest.startDate}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.startDate && <p className="error-message">{errors.startDate}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="documents">Upload Documents</label>
                            <input
                                type="file"
                                id="documents"
                                name="documents"
                                multiple
                                onChange={handleFileChange}
                            />
                            {newRequest.documents.length > 0 && (
                                <div style={{ marginTop: 'var(--spacing-sm)' }}>
                                    <h5>Uploaded:</h5>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {newRequest.documents.map((doc, index) => (
                                            <li key={index} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                                📄 {doc.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="form-actions">
                            <button type="button" className="button secondary" onClick={() => navigate('ONBOARDING_REQUESTS')}>Cancel</button>
                            <button type="submit" className="button">Create Request</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const renderScreen = () => {
        if (!currentUser && view.screen !== 'LOGIN') {
            return <LoginScreen />;
        }

        switch (view.screen) {
            case 'LOGIN':
                return <LoginScreen />;
            case 'DASHBOARD':
                return canAccess([ROLES.ADMIN, ROLES.HR_TEAM, ROLES.HIRING_MANAGER, ROLES.IT_TEAM, ROLES.EMPLOYEE]) ? <DashboardScreen /> : <p className="container">Access Denied</p>;
            case 'ONBOARDING_REQUESTS':
                return canAccess([ROLES.ADMIN, ROLES.HR_TEAM, ROLES.HIRING_MANAGER]) ? <OnboardingRequestsListScreen /> : <p className="container">Access Denied</p>;
            case 'ONBOARDING_REQUEST_DETAIL':
                return canAccess([ROLES.ADMIN, ROLES.HR_TEAM, ROLES.HIRING_MANAGER, ROLES.IT_TEAM]) ? <OnboardingRequestDetailScreen /> : <p className="container">Access Denied</p>;
            case 'NEW_ONBOARDING_REQUEST':
                return canAccess([ROLES.ADMIN, ROLES.HR_TEAM, ROLES.HIRING_MANAGER]) ? <NewOnboardingRequestScreen /> : <p className="container">Access Denied</p>;
            case 'EMPLOYEE_MANAGEMENT':
                return canAccess([ROLES.ADMIN, ROLES.HR_TEAM, ROLES.HIRING_MANAGER, ROLES.IT_TEAM]) ? <EmployeeManagementListScreen /> : <p className="container">Access Denied</p>;
            case 'EMPLOYEE_DETAIL':
                return canAccess([ROLES.ADMIN, ROLES.HR_TEAM, ROLES.HIRING_MANAGER, ROLES.IT_TEAM]) ? <EmployeeDetailScreen /> : <p className="container">Access Denied</p>;
            case 'USER_MANAGEMENT':
                return canAccess([ROLES.ADMIN]) ? <UserManagementScreen /> : <p className="container">Access Denied</p>;
            case 'MY_ONBOARDING':
                return canAccess([ROLES.EMPLOYEE]) ? <MyOnboardingScreen /> : <p className="container">Access Denied</p>;
            case 'MY_TASKS':
                return canAccess([ROLES.EMPLOYEE, ROLES.IT_TEAM]) ? <MyTasksScreen /> : <p className="container">Access Denied</p>;
            case 'AUDIT_LOGS':
                return canAccess([ROLES.ADMIN, ROLES.HR_TEAM]) ? <AuditLogsScreen /> : <p className="container">Access Denied</p>;
            case 'SETTINGS':
                return <SettingsScreen />;
            case 'SEARCH_RESULTS':
                return <div className="container"><h2>Search Results for "{view.params.query}"</h2><p>This would be a dedicated search results page, displaying relevant cards from all entities.</p><button className="button" onClick={() => navigate('DASHBOARD')}>Back to Dashboard</button></div>;
            default:
                return <p className="container">404: Screen Not Found</p>;
        }
    };

    return (
        <div className="App">
            {currentUser && (
                <>
                    <header className="app-header">
                        <span className="logo" onClick={() => navigate('DASHBOARD')} style={{ cursor: 'pointer' }}>Employee Onboarding Platform</span>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <input
                                type="text"
                                placeholder="Global Search..."
                                className={`global-search-input ${isGlobalSearchOpen ? '' : 'hidden'}`}
                                value={globalSearchTerm}
                                onChange={handleGlobalSearchChange}
                                onKeyDown={(e) => (e.key === 'Enter') && handleGlobalSearchSubmit(e)}
                            />
                            <button
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--color-text-light)',
                                    cursor: 'pointer',
                                    fontSize: 'var(--font-size-lg)'
                                }}
                                onClick={() => setIsGlobalSearchOpen(prev => !prev)}
                            >
                                🔍
                            </button>
                            <div className="user-info">
                                <span>Hello, {currentUser?.name} ({currentUser?.role})</span>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        </div>
                    </header>

                    <nav className="app-nav">
                        <ul>
                            <li><a className={view.screen === 'DASHBOARD' ? 'active' : ''} onClick={() => navigate('DASHBOARD')}>Dashboard</a></li>
                            {canAccess([ROLES.HR_TEAM, ROLES.ADMIN, ROLES.HIRING_MANAGER]) && <li><a className={view.screen.startsWith('ONBOARDING_REQUEST') ? 'active' : ''} onClick={() => navigate('ONBOARDING_REQUESTS')}>Onboarding Requests</a></li>}
                            {canAccess([ROLES.HR_TEAM, ROLES.ADMIN, ROLES.HIRING_MANAGER, ROLES.IT_TEAM]) && <li><a className={view.screen.startsWith('EMPLOYEE_MANAGEMENT') || view.screen.startsWith('EMPLOYEE_DETAIL') ? 'active' : ''} onClick={() => navigate('EMPLOYEE_MANAGEMENT')}>Employee Management</a></li>}
                            {canAccess([ROLES.EMPLOYEE]) && <li><a className={view.screen === 'MY_ONBOARDING' ? 'active' : ''} onClick={() => navigate('MY_ONBOARDING')}>My Onboarding</a></li>}
                            {canAccess([ROLES.EMPLOYEE, ROLES.IT_TEAM]) && <li><a className={view.screen === 'MY_TASKS' ? 'active' : ''} onClick={() => navigate('MY_TASKS')}>My Tasks</a></li>}
                            {canAccess([ROLES.ADMIN]) && <li><a className={view.screen === 'USER_MANAGEMENT' ? 'active' : ''} onClick={() => navigate('USER_MANAGEMENT')}>User Management</a></li>}
                            {canAccess([ROLES.ADMIN, ROLES.HR_TEAM]) && <li><a className={view.screen === 'AUDIT_LOGS' ? 'active' : ''} onClick={() => navigate('AUDIT_LOGS')}>Audit Logs</a></li>}
                            <li><a className={view.screen === 'SETTINGS' ? 'active' : ''} onClick={() => navigate('SETTINGS')}>Settings</a></li>
                        </ul>
                    </nav>
                </>
            )}

            <main className="app-main">
                {renderScreen()}
            </main>
        </div>
    );
}

export default App;
