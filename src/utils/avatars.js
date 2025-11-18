/**
 * Avatar utility functions
 */

export const avatars = [
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

export const getAvatar = (avatarId) => {
  return avatars.find(a => a.id === avatarId) || avatars[0];
};

export const getAvatarEmoji = (avatarId) => {
  const avatar = getAvatar(avatarId);
  return avatar.emoji;
};

export const getAvatarName = (avatarId) => {
  const avatar = getAvatar(avatarId);
  return avatar.name;
};

export const getAvatarColor = (avatarId) => {
  const avatar = getAvatar(avatarId);
  return avatar.color;
};

export const getRandomAvatar = () => {
  return avatars[Math.floor(Math.random() * avatars.length)];
};
