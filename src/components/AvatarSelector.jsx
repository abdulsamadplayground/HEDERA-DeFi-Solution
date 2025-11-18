import { useState } from 'react';
import './AvatarSelector.css';

function AvatarSelector({ onSelect, selectedAvatar }) {
  const [hoveredAvatar, setHoveredAvatar] = useState(null);

  const avatars = [
    { id: 'mage', name: 'Mage', emoji: '🧙', color: '#9c27b0' },
    { id: 'knight', name: 'Knight', emoji: '⚔️', color: '#2196f3' },
    { id: 'witch', name: 'Witch', emoji: '🧙‍♀️', color: '#4caf50' },
    { id: 'king', name: 'King', emoji: '👑', color: '#ff9800' },
    { id: 'queen', name: 'Queen', emoji: '👸', color: '#e91e63' },
    { id: 'devil', name: 'Devil', emoji: '😈', color: '#f44336' },
    { id: 'ninja', name: 'Ninja', emoji: '🥷', color: '#424242' },
    { id: 'pirate', name: 'Pirate', emoji: '🏴‍☠️', color: '#795548' },
    { id: 'robot', name: 'Robot', emoji: '🤖', color: '#607d8b' },
    { id: 'alien', name: 'Alien', emoji: '👽', color: '#00bcd4' },
    { id: 'vampire', name: 'Vampire', emoji: '🧛', color: '#880e4f' },
    { id: 'wizard', name: 'Wizard', emoji: '🧙‍♂️', color: '#673ab7' },
    { id: 'elf', name: 'Elf', emoji: '🧝', color: '#8bc34a' },
    { id: 'warrior', name: 'Warrior', emoji: '🛡️', color: '#ff5722' },
    { id: 'samurai', name: 'Samurai', emoji: '⚔️', color: '#d32f2f' },
    { id: 'dragon', name: 'Dragon', emoji: '🐉', color: '#f57c00' }
  ];

  return (
    <div className="avatar-selector">
      <h3>Choose Your Avatar</h3>
      <p className="avatar-hint">Select a character to represent you in the arena</p>
      
      <div className="avatars-grid">
        {avatars.map(avatar => (
          <div
            key={avatar.id}
            className={`avatar-option ${selectedAvatar === avatar.id ? 'selected' : ''}`}
            onClick={() => onSelect(avatar.id)}
            onMouseEnter={() => setHoveredAvatar(avatar.id)}
            onMouseLeave={() => setHoveredAvatar(null)}
            style={{
              borderColor: selectedAvatar === avatar.id ? avatar.color : '#e0e0e0',
              backgroundColor: selectedAvatar === avatar.id ? `${avatar.color}15` : 'white'
            }}
          >
            <div className="avatar-emoji">{avatar.emoji}</div>
            <div className="avatar-name" style={{ color: avatar.color }}>
              {avatar.name}
            </div>
            {selectedAvatar === avatar.id && (
              <div className="selected-indicator">✓</div>
            )}
          </div>
        ))}
      </div>

      {hoveredAvatar && (
        <div className="avatar-preview">
          <span className="preview-label">Preview:</span>
          <span className="preview-emoji">
            {avatars.find(a => a.id === hoveredAvatar)?.emoji}
          </span>
          <span className="preview-name">
            {avatars.find(a => a.id === hoveredAvatar)?.name}
          </span>
        </div>
      )}
    </div>
  );
}

export default AvatarSelector;
