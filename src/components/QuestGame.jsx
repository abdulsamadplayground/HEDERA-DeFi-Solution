import { useState, useEffect, useRef } from 'react';

function QuestGame({ onWin, onLose, gameType }) {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 80 });
  const [monsters, setMonsters] = useState([]);
  const [fireballs, setFireballs] = useState([]);
  const [buffs, setBuffs] = useState([]);
  const [health, setHealth] = useState(100);
  const [wave, setWave] = useState(1);
  const [monstersKilled, setMonstersKilled] = useState(0);
  const [isBossActive, setIsBossActive] = useState(false);
  const [bossSpawned, setBossSpawned] = useState(false);
  const [waveStarting, setWaveStarting] = useState(true);
  const [notification, setNotification] = useState('');
  const [earnedHBAR, setEarnedHBAR] = useState(0);
  const [activeBuffs, setActiveBuffs] = useState({ multishot: 0, shield: 0, attackSpeed: 0 });
  const [slashing, setSlashing] = useState(false);
  const [attackCooldown, setAttackCooldown] = useState(false);
  const [keys, setKeys] = useState({});
  const gameLoopRef = useRef(null);
  const spawnTimerRef = useRef(0);
  const monstersRef = useRef([]);
  const fireballsRef = useRef([]);
  const playerPosRef = useRef({ x: 50, y: 80 });
  const slashingRef = useRef(false);

  const monstersPerWave = 12;
  const maxWaves = 3;
  const HBAR_PER_WAVE = 300;
  const COMPLETION_BONUS = 100;

  const getBossForWave = (waveNum) => {
    const bosses = [
      { emoji: '👹', icon: '👹', name: 'Ogre Lord', hp: 15, maxHp: 15, speed: 0.8, points: 200, damage: 20, attackCooldown: 0 },
      { emoji: '💀', icon: '💀', name: 'Lich King', hp: 20, maxHp: 20, speed: 0.7, points: 300, damage: 30, attackCooldown: 0 },
      { emoji: '🧙‍♀️', icon: '🧙‍♀️', name: 'Dark Witch', hp: 25, maxHp: 25, speed: 0.5, points: 500, damage: 40, attackCooldown: 0 }
    ];
    return bosses[waveNum - 1];
  };

  const getWaveBackground = () => {
    const backgrounds = [
      'url(/assets/backgrounds/forest.jpeg)',
      'url(/assets/backgrounds/dungeon.jpeg)',
      'url(/assets/backgrounds/tower.jpeg)'
    ];
    const overlays = [
      'linear-gradient(rgba(45, 80, 22, 0.4), rgba(30, 58, 15, 0.5))',
      'linear-gradient(rgba(26, 26, 46, 0.6), rgba(10, 10, 20, 0.7))',
      'linear-gradient(rgba(74, 10, 46, 0.5), rgba(42, 5, 24, 0.6))'
    ];
    const baseImage = backgrounds[wave - 1] || backgrounds[0];
    return `${overlays[wave - 1] || overlays[0]}, ${baseImage}`;
  };

  // Update refs when state changes
  useEffect(() => {
    monstersRef.current = monsters;
  }, [monsters]);

  useEffect(() => {
    fireballsRef.current = fireballs;
  }, [fireballs]);

  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);

  useEffect(() => {
    slashingRef.current = slashing;
  }, [slashing]);

  useEffect(() => {
    if (!gameOver && health > 0) {
      gameLoopRef.current = setInterval(gameLoop, 30);
      return () => clearInterval(gameLoopRef.current);
    }
  }, [monsters, fireballs, buffs, gameOver, health, activeBuffs, slashing, waveStarting, playerPos, keys, monstersKilled, isBossActive, bossSpawned]);

  useEffect(() => {
    showNotification('⚔️ Wave 1 Starting!', 2000);
    setTimeout(() => setWaveStarting(false), 2000);
  }, []);

  useEffect(() => {
    const buffTimer = setInterval(() => {
      setActiveBuffs(prev => ({
        multishot: Math.max(0, prev.multishot - 1),
        shield: Math.max(0, prev.shield - 1),
        attackSpeed: Math.max(0, prev.attackSpeed - 1)
      }));
    }, 1000);
    return () => clearInterval(buffTimer);
  }, []);

  const getMonsterType = () => {
    const types = [
      { emoji: '👺', hp: 1, speed: 1.5, points: 10, damage: 5, icon: '👺', name: 'Goblin' },
      { emoji: '🧟', hp: 2, speed: 1.2, points: 20, damage: 10, icon: '🧟', name: 'Zombie' },
      { emoji: '🧛', hp: 1, speed: 2, points: 15, damage: 8, icon: '🧛', name: 'Vampire' }
    ];
    return types[Math.floor(Math.random() * types.length)];
  };

  const spawnBuff = (x, y) => {
    const buffTypes = ['multishot', 'shield', 'attackSpeed', 'healing'];
    const buffType = buffTypes[Math.floor(Math.random() * buffTypes.length)];
    const buffEmojis = { multishot: '⚡', shield: '🛡️', attackSpeed: '⚔️', healing: '💚' };
    setBuffs(prev => [...prev, { id: Date.now(), x, y, type: buffType, emoji: buffEmojis[buffType] }]);
  };

  const spawnBoss = () => {
    // Double-check to prevent duplicate spawns
    if (bossSpawned || isBossActive) {
      console.log('[QuestGame] Boss spawn prevented - already spawned or active');
      return;
    }
    
    console.log(`[QuestGame] Spawning boss for wave ${wave}`);
    const bossTemplate = getBossForWave(wave);
    const boss = { ...bossTemplate, id: Date.now() + wave * 1000, x: 50, y: 5, isBoss: true };
    console.log(`[QuestGame] Boss data:`, boss);
    
    // Set all states together to prevent race conditions
    setMonsters([boss]);
    setIsBossActive(true);
    setBossSpawned(true);
    
    showNotification(`👑 ${boss.name} Appears!`, 2500);
  };

  const gameLoop = () => {
    // Player movement (prevent default page scrolling)
    if (keys['ArrowLeft']) {
      setPlayerPos(prev => ({ ...prev, x: Math.max(5, prev.x - 2.5) }));
    }
    if (keys['ArrowRight']) {
      setPlayerPos(prev => ({ ...prev, x: Math.min(95, prev.x + 2.5) }));
    }
    if (keys['ArrowUp']) {
      setPlayerPos(prev => ({ ...prev, y: Math.max(15, prev.y - 2.5) }));
    }
    if (keys['ArrowDown']) {
      setPlayerPos(prev => ({ ...prev, y: Math.min(90, prev.y + 2.5) }));
    }

    if (waveStarting) return;

    // Spawn regular monsters
    if (!isBossActive && monstersKilled < monstersPerWave) {
      spawnTimerRef.current++;
      if (spawnTimerRef.current > 60) {
        spawnTimerRef.current = 0;
        const monsterType = getMonsterType();
        setMonsters(prev => [...prev, {
          id: Date.now() + Math.random(),
          x: Math.random() * 80 + 10,
          y: 0,
          ...monsterType
        }]);
      }
    }

    // Check if should spawn boss (only once per wave)
    // Boss spawns when: not active, not already spawned, killed 12 monsters, and no monsters on screen
    if (!isBossActive && !bossSpawned && monstersKilled >= monstersPerWave && monsters.length === 0) {
      console.log('[QuestGame] Boss spawn conditions met - spawning boss');
      spawnBoss();
      return; // Exit early to prevent any other spawning logic
    }

    // Move monsters
    setMonsters(prev => {
      const updated = prev.map(monster => {
      let newX = monster.x;
      let newY = monster.y + monster.speed;
      let updatedMonster = { ...monster };

      // Boss behavior
      if (monster.isBoss) {
        if (monster.y < 20) {
          newY = monster.y + 0.5;
        } else {
          newY = 20;
          newX += Math.sin(Date.now() / 800) * 0.4;
          
          // Boss attacks player
          updatedMonster.attackCooldown = (updatedMonster.attackCooldown || 0) - 1;
          if (updatedMonster.attackCooldown <= 0) {
            // Check if boss can attack player
            const distanceToPlayer = Math.sqrt(
              Math.pow(playerPos.x - newX, 2) + Math.pow(playerPos.y - newY, 2)
            );
            if (distanceToPlayer < 30) {
              // Boss attacks!
              if (activeBuffs.shield <= 0) {
                setHealth(prev => {
                  const newHealth = Math.max(0, prev - monster.damage);
                  if (newHealth <= 0) endGame(false);
                  return newHealth;
                });
              }
              updatedMonster.attackCooldown = 60; // Attack every 2 seconds
            }
          }
        }
      }

      return { ...updatedMonster, x: Math.max(5, Math.min(95, newX)), y: newY };
    }).filter(monster => {
      if (monster.y > 100) return false;
      
      // Collision with player
      if (Math.abs(monster.y - playerPos.y) < 5 && Math.abs(monster.x - playerPos.x) < 5) {
        if (activeBuffs.shield > 0) {
          setActiveBuffs(prev => ({ ...prev, shield: 0 }));
          return false;
        } else {
          setHealth(prev => {
            const newHealth = Math.max(0, prev - (monster.damage || 10));
            if (newHealth <= 0) endGame(false);
            return newHealth;
          });
          return false;
        }
      }
      return true;
    });
      monstersRef.current = updated;
      return updated;
    });

    // Move fireballs and check collisions in single update
    const currentMonsters = monstersRef.current;
    setFireballs(prevFireballs => {
      const movedFireballs = prevFireballs.map(fb => ({ ...fb, y: fb.y - 5 })).filter(fb => fb.y > 0);
      
      // Find which monsters were hit
      const hitMonsterIds = new Set();
      const remainingFireballs = movedFireballs.filter(fb => {
        let hit = false;
        currentMonsters.forEach(m => {
          const distance = Math.sqrt(Math.pow(fb.x - m.x, 2) + Math.pow(fb.y - m.y, 2));
          if (!hitMonsterIds.has(m.id) && distance < 6) {
            console.log('[QuestGame] Fireball hit monster!', m.name || m.emoji, 'HP:', m.hp);
            hit = true;
            hitMonsterIds.add(m.id);
          }
        });
        return !hit;
      });
      
      // Update monsters that were hit
      if (hitMonsterIds.size > 0) {
        setMonsters(prevMonsters => {
          const updated = prevMonsters.map(m => {
            if (hitMonsterIds.has(m.id)) {
              const newHp = m.hp - 1;
              console.log('[QuestGame] Monster damaged:', m.name || m.emoji, 'New HP:', newHp);
              if (newHp <= 0) {
                console.log('[QuestGame] Monster killed!', m.name || m.emoji);
                setScore(s => s + m.points);
                if (Math.random() < 0.25) spawnBuff(m.x, m.y);
                if (m.isBoss) {
                  handleBossDefeat(m);
                } else {
                  setMonstersKilled(prev => prev + 1);
                }
                return null;
              }
              return { ...m, hp: newHp };
            }
            return m;
          }).filter(Boolean);
          monstersRef.current = updated;
          return updated;
        });
      }
      
      fireballsRef.current = remainingFireballs;
      return remainingFireballs;
    });

    // Handle slash collisions
    if (slashing) {
      setMonsters(prevMonsters => {
        const updated = prevMonsters.map(monster => {
          const distance = Math.sqrt(Math.pow(monster.x - playerPos.x, 2) + Math.pow(monster.y - playerPos.y, 2));
          if (distance < 12) {
            console.log('[QuestGame] Slash hit monster!', monster.name || monster.emoji, 'HP:', monster.hp);
            const newHp = monster.hp - 1;
            if (newHp <= 0) {
              console.log('[QuestGame] Monster slashed to death!', monster.name || monster.emoji);
              setScore(s => s + monster.points);
              if (Math.random() < 0.25) spawnBuff(monster.x, monster.y);
              if (monster.isBoss) {
                handleBossDefeat(monster);
              } else {
                setMonstersKilled(prev => prev + 1);
              }
              return null;
            }
            return { ...monster, hp: newHp };
          }
          return monster;
        }).filter(Boolean);
        monstersRef.current = updated;
        return updated;
      });
    }

    // Move buffs
    setBuffs(prev => prev.map(buff => ({ ...buff, y: buff.y + 1.5 })).filter(buff => {
      if (buff.y > 100) return false;
      if (Math.abs(buff.y - playerPos.y) < 5 && Math.abs(buff.x - playerPos.x) < 5) {
        if (buff.type === 'healing') {
          setHealth(prev => Math.min(100, prev + 20));
        } else {
          setActiveBuffs(prev => ({ ...prev, [buff.type]: prev[buff.type] + 10 }));
        }
        return false;
      }
      return true;
    }));
  };



  const handleBossDefeat = (boss) => {
    console.log(`[QuestGame] Boss ${boss.name} defeated! Wave ${wave} complete.`);
    
    // Immediately clear boss states to prevent re-spawning
    setIsBossActive(false);
    setMonsters([]);
    
    const newEarned = earnedHBAR + HBAR_PER_WAVE;
    setEarnedHBAR(newEarned);
    showNotification(`✨ ${boss.name} Defeated! +${HBAR_PER_WAVE} HBAR`, 2500);
    
    if (wave >= maxWaves) {
      const finalEarned = newEarned + COMPLETION_BONUS;
      setTimeout(() => {
        showNotification(`🏆 ALL WAVES CLEARED! +${COMPLETION_BONUS} BONUS! Total: ${finalEarned} HBAR! 🏆`, 3000);
        setTimeout(() => {
          setGameOver(true);
          clearInterval(gameLoopRef.current);
          onWin(finalEarned, { gameType, score, wave: maxWaves, result: 'complete' });
        }, 3000);
      }, 2500);
    } else {
      const nextWave = wave + 1;
      console.log(`[QuestGame] Moving to wave ${nextWave}`);
      setTimeout(() => {
        // Reset all wave-related states for new wave
        console.log(`[QuestGame] Resetting for wave ${nextWave}`);
        setWave(nextWave);
        setMonstersKilled(0);
        setBossSpawned(false); // Critical: Reset boss spawn flag for new wave
        setIsBossActive(false); // Ensure boss is not active
        setWaveStarting(true);
        spawnTimerRef.current = 0;
        showNotification(`⚔️ Wave ${nextWave} Starting!`, 2000);
        setTimeout(() => setWaveStarting(false), 2000);
      }, 2500);
    }
  };

  const endGame = (won) => {
    setGameOver(true);
    clearInterval(gameLoopRef.current);
    if (won || earnedHBAR >= 300) {
      setTimeout(() => onWin(earnedHBAR, { gameType, score, wave, result: 'win' }), 1000);
    } else {
      setTimeout(() => onLose(), 1000);
    }
  };

  const shootFireball = () => {
    if (attackCooldown) return;
    setAttackCooldown(true);
    setTimeout(() => setAttackCooldown(false), activeBuffs.attackSpeed > 0 ? 150 : 300);
    const shots = activeBuffs.multishot > 0 ? 3 : 1;
    const newFireballs = [];
    for (let i = 0; i < shots; i++) {
      newFireballs.push({
        id: Date.now() + i,
        x: playerPos.x + (i - Math.floor(shots / 2)) * 5,
        y: playerPos.y - 5
      });
    }
    setFireballs(prev => [...prev, ...newFireballs]);
  };

  const slash = () => {
    if (slashing) return;
    setSlashing(true);
    setTimeout(() => setSlashing(false), 200);
  };

  const handleKeyDown = (e) => {
    if (gameOver || health <= 0) return;
    
    // Prevent default page scrolling for arrow keys and space
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }
    
    setKeys(prev => ({ ...prev, [e.key]: true }));
    
    if (e.key === ' ') {
      shootFireball();
    } else if (e.key.toLowerCase() === 'x') {
      slash();
    }
  };

  const handleKeyUp = (e) => {
    // Prevent default page scrolling for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }
    setKeys(prev => ({ ...prev, [e.key]: false }));
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver, health, attackCooldown, slashing, activeBuffs]);

  const showNotification = (message, duration = 2000) => {
    setNotification(message);
    setTimeout(() => setNotification(''), duration);
  };

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setMonsters([]);
    setFireballs([]);
    setBuffs([]);
    setPlayerPos({ x: 50, y: 80 });
    setEarnedHBAR(0);
    setHealth(100);
    setWave(1);
    setMonstersKilled(0);
    setIsBossActive(false);
    setBossSpawned(false);
    setWaveStarting(true);
    setNotification('');
    setActiveBuffs({ multishot: 0, shield: 0, attackSpeed: 0 });
    setSlashing(false);
    setKeys({});
    spawnTimerRef.current = 0;
    setTimeout(() => {
      showNotification('⚔️ Wave 1 Starting!', 2000);
      setWaveStarting(false);
    }, 500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>⚔️ Knight's Quest</h3>
        <p style={styles.subtitle}>Clear all 3 waves! Beat 12 enemies then defeat the boss. 300 HBAR per wave + 100 HBAR completion bonus = 1000 HBAR total!</p>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.stat}>Score: {score}</div>
        <div style={styles.stat}>Wave: {wave}/{maxWaves} {isBossActive && '👑 BOSS'}</div>
        <div style={styles.stat}>Killed: {monstersKilled}/{monstersPerWave}</div>
        <div style={styles.stat}>
          <div style={styles.healthBarContainer}>
            <div style={{...styles.healthBar, width: `${health}%`, backgroundColor: health > 50 ? '#48bb78' : health > 25 ? '#ed8936' : '#f56565'}}></div>
            <span style={styles.healthText}>{health}/100 HP</span>
          </div>
        </div>
        <div style={styles.stat}>Earned: {earnedHBAR} HBAR</div>
      </div>

      <div style={styles.buffsRow}>
        {activeBuffs.multishot > 0 && <span style={styles.buff}>⚡ Multishot ({activeBuffs.multishot}s)</span>}
        {activeBuffs.shield > 0 && <span style={styles.buff}>🛡️ Shield ({activeBuffs.shield}s)</span>}
        {activeBuffs.attackSpeed > 0 && <span style={styles.buff}>⚔️ Fast Attack ({activeBuffs.attackSpeed}s)</span>}
      </div>

      <div style={{...styles.gameArea, background: getWaveBackground(), backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
        {/* Player */}
        <div style={{
          ...styles.player,
          left: `${playerPos.x}%`,
          top: `${playerPos.y}%`,
          fontSize: slashing ? '52px' : '36px'
        }}>
          {slashing ? '⚔️' : '🧙‍♂️'}
        </div>

        {/* Monsters */}
        {monsters.map(monster => {
          const displayIcon = monster.icon || monster.emoji || (monster.isBoss ? '👑' : '👾');
          return (
            <div key={monster.id} style={{
              ...styles.monster,
              left: `${monster.x}%`,
              top: `${monster.y}%`,
              fontSize: monster.isBoss ? '72px' : '36px',
              zIndex: monster.isBoss ? 100 : 50
            }}>
              {displayIcon}
              {monster.isBoss && <div style={styles.bossName}>{monster.name}</div>}
              {monster.hp > 1 && (
                <div style={styles.hp}>
                  {monster.isBoss && monster.maxHp ? (
                    <>
                      <div style={{...styles.hpBar, width: `${(monster.hp / monster.maxHp) * 100}%`}}></div>
                      <span style={{position: 'relative', zIndex: 2, color: '#fff', fontWeight: 'bold'}}>{monster.hp}/{monster.maxHp}</span>
                    </>
                  ) : `${monster.hp}HP`}
                </div>
              )}
            </div>
          );
        })}

        {/* Fireballs */}
        {fireballs.map(fb => (
          <div key={fb.id} style={{...styles.fireball, left: `${fb.x}%`, top: `${fb.y}%`}}>🔥</div>
        ))}

        {/* Buffs */}
        {buffs.map(buff => (
          <div key={buff.id} style={{...styles.buffItem, left: `${buff.x}%`, top: `${buff.y}%`}}>{buff.emoji}</div>
        ))}
      </div>

      <div style={styles.controls}>
        <p style={styles.controlText}>Arrow Keys: Move | SPACE: Fire | X: Slash | 💚 Heals +20 HP</p>
        {!gameOver && health > 0 && earnedHBAR >= 300 && (
          <button onClick={() => endGame(true)} style={styles.btnSecondary}>
            Cash Out ({earnedHBAR} HBAR)
          </button>
        )}
      </div>

      {notification && (
        <div style={styles.notification}>
          <p style={styles.notificationText}>{notification}</p>
        </div>
      )}

      {(gameOver || health <= 0) && (
        <div style={styles.result}>
          {earnedHBAR >= 300 ? (
            <p style={styles.win}>
              {wave >= maxWaves 
                ? `🏆 LEGENDARY! All 3 Waves Conquered! Staking ${earnedHBAR} HBAR! 🏆` 
                : `🎉 Quest Complete! Cleared ${wave} Wave${wave > 1 ? 's' : ''}! Score: ${score}! Staking ${earnedHBAR} HBAR...`}
            </p>
          ) : (
            <>
              <p style={styles.lose}>💀 Quest Failed! Complete at least Wave 1 to stake. Try again?</p>
              <button onClick={resetGame} style={styles.btnPrimary}>New Quest</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '95vw', width: '100%', minHeight: '85vh', margin: '0 auto', fontFamily: 'Arial, sans-serif', backgroundColor: '#1a1a2e', borderRadius: '10px', color: '#fff' },
  header: { textAlign: 'center', marginBottom: '20px' },
  title: { fontSize: '28px', margin: '0 0 10px 0', color: '#ffd700' },
  subtitle: { margin: 0, color: '#aaa', fontSize: '13px' },
  statsRow: { display: 'flex', justifyContent: 'space-around', marginBottom: '15px', padding: '10px', backgroundColor: '#16213e', borderRadius: '8px', flexWrap: 'wrap', gap: '10px' },
  stat: { fontSize: '14px', fontWeight: 'bold', color: '#fff' },
  healthBarContainer: { position: 'relative', width: '120px', height: '18px', backgroundColor: '#2d3748', borderRadius: '10px', overflow: 'hidden', border: '2px solid #4a5568' },
  healthBar: { position: 'absolute', top: 0, left: 0, height: '100%', transition: 'width 0.3s ease, background-color 0.3s ease', borderRadius: '8px' },
  healthText: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '10px', fontWeight: 'bold', color: '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.8)', zIndex: 1 },
  buffsRow: { display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '10px', minHeight: '30px', flexWrap: 'wrap' },
  buff: { padding: '5px 12px', backgroundColor: '#4a5568', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' },
  gameArea: { position: 'relative', width: '100%', height: '65vh', minHeight: '500px', borderRadius: '8px', overflow: 'hidden', marginBottom: '15px', boxShadow: 'inset 0 0 80px rgba(0, 0, 0, 0.6)', border: '3px solid #667eea' },
  player: { position: 'absolute', fontSize: '36px', transform: 'translate(-50%, -50%)', transition: 'font-size 0.1s ease', filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.9))', zIndex: 200 },
  monster: { position: 'absolute', fontSize: '36px', transform: 'translateX(-50%)', filter: 'drop-shadow(0 0 10px rgba(255, 0, 0, 0.7))' },
  hp: { position: 'absolute', top: '-28px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', backgroundColor: '#e53e3e', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold', whiteSpace: 'nowrap', minWidth: '60px', textAlign: 'center', border: '2px solid #fff' },
  hpBar: { position: 'absolute', top: 0, left: 0, height: '100%', backgroundColor: '#48bb78', transition: 'width 0.3s ease', borderRadius: '4px', zIndex: 1 },
  bossName: { position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', fontSize: '14px', backgroundColor: '#742a2a', padding: '5px 12px', borderRadius: '6px', fontWeight: 'bold', whiteSpace: 'nowrap', color: '#ffd700', border: '3px solid #ffd700', boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)' },
  fireball: { position: 'absolute', fontSize: '22px', transform: 'translateX(-50%)', filter: 'drop-shadow(0 0 8px rgba(255, 100, 0, 0.9))', zIndex: 150 },
  buffItem: { position: 'absolute', fontSize: '26px', transform: 'translateX(-50%)', animation: 'pulse 1s infinite', zIndex: 100 },
  controls: { textAlign: 'center' },
  controlText: { margin: '10px 0', color: '#ddd', fontSize: '14px' },
  btnSecondary: { padding: '10px 20px', fontSize: '16px', backgroundColor: '#ed8936', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' },
  btnPrimary: { padding: '12px 24px', fontSize: '16px', backgroundColor: '#48bb78', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' },
  result: { textAlign: 'center', padding: '20px', backgroundColor: '#16213e', borderRadius: '8px', marginTop: '15px' },
  notification: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0, 0, 0, 0.95)', padding: '35px 60px', borderRadius: '15px', border: '4px solid #ffd700', zIndex: 10000, boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)' },
  notificationText: { color: '#ffd700', fontSize: '32px', fontWeight: 'bold', margin: 0, textAlign: 'center', textShadow: '3px 3px 6px rgba(0, 0, 0, 0.9)' },
  win: { color: '#48bb78', fontSize: '20px', fontWeight: 'bold', margin: 0 },
  lose: { color: '#f56565', fontSize: '18px', fontWeight: 'bold', margin: '0 0 15px 0' }
};

export default QuestGame;
