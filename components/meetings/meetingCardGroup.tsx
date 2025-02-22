import React from 'react';

const meetingCardGroup = ({ group }) => {
    console.log('group', group);
    return (
        <div style={{ width: '100%' }}>
            <div
                className='meeting-card-group'
                style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'minmax(200px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr)',
                    gap: '1rem',
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #eee',
                }}
            >
                <h4 style={{ margin: 0 }}>{group.title}</h4>
                <p style={{ margin: 0 }}>{group.location}</p>
                <p style={{ margin: 0 }}>{group.facilitator}</p>
            </div>
        </div>
    );
};

export default meetingCardGroup;
