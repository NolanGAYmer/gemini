const ACTOR_TRACK = document.getElementById('actor-track');
const ACTOR_ELEMENT = document.getElementById('actor');
const CURRENT_FRAME_DISPLAY = document.getElementById('current-frame');

// Simuler les Keyframes (position X, en % de la timeline)
let keyframes = [
    { frame: 0, positionX: 50, timelinePos: 0 },
    { frame: 50, positionX: 300, timelinePos: 30 },
    { frame: 100, positionX: 50, timelinePos: 60 }
];

let currentFrame = 0;
const MAX_FRAME = 100;
let animationInterval = null;

/**
 * Met à jour la position de l'acteur en fonction des keyframes
 * (Très simplifiée : interpolation linéaire entre les keyframes les plus proches).
 */
function updateActorPosition(frame) {
    if (keyframes.length < 2) return;

    // Trouver les keyframes de début et de fin
    let startKf = keyframes.filter(kf => kf.frame <= frame).pop();
    let endKf = keyframes.filter(kf => kf.frame > frame).shift();

    if (!startKf) {
        startKf = keyframes[0];
        endKf = keyframes[1];
    }
    if (!endKf) {
        endKf = keyframes[keyframes.length - 1];
        startKf = keyframes[keyframes.length - 2];
    }
    
    // Interpolation linéaire (Simple pour l'exemple)
    const totalFrames = endKf.frame - startKf.frame;
    const progress = (frame - startKf.frame) / totalFrames;

    // Calculer la nouvelle position (ici, on utilise 'left' pour la simulation 2D)
    const newX = startKf.positionX + (endKf.positionX - startKf.positionX) * progress;
    
    // Appliquer la transformation à l'élément
    ACTOR_ELEMENT.style.transform = `translate(${newX}px, -50%)`;
    CURRENT_FRAME_DISPLAY.textContent = `Frame: ${frame}`;
}

/**
 * Dessine tous les keyframes sur la timeline.
 */
function renderKeyframes() {
    ACTOR_TRACK.innerHTML = '';
    keyframes.forEach(kf => {
        const keyframeDiv = document.createElement('div');
        keyframeDiv.className = 'keyframe';
        // La position est basée sur le pourcentage de la longueur totale de l'animation
        keyframeDiv.style.left = `${kf.timelinePos}%`; 
        keyframeDiv.title = `Frame: ${kf.frame}, X: ${kf.positionX}`;
        ACTOR_TRACK.appendChild(keyframeDiv);
    });
}

/**
 * Fonction appelée par le bouton "Play".
 */
window.playAnimation = function() {
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
        return; // Arrêter si déjà en cours
    }

    currentFrame = 0;
    
    animationInterval = setInterval(() => {
        currentFrame++;
        if (currentFrame > MAX_FRAME) {
            currentFrame = 0; // Boucle
        }
        
        // Mettre à jour l'acteur et l'affichage
        updateActorPosition(currentFrame);
        
    }, 50); // Simuler 20 images par seconde (1000ms / 20fps = 50ms)
}

/**
 * Fonction appelée par le bouton "Ajouter Keyframe".
 */
window.addKeyframe = function() {
    // Dans une vraie application, on obtiendrait la position/propriété actuelle
    // Pour l'exemple, on ajoute simplement une keyframe à la fin de la timeline
    const newFrame = MAX_FRAME + 10;
    const newPos = Math.random() * 400 + 50; // Nouvelle position aléatoire
    
    keyframes.push({ 
        frame: newFrame, 
        positionX: newPos, 
        timelinePos: (newFrame / MAX_FRAME) * 60 + 5 // Simuler une position sur la timeline
    });
    
    keyframes.sort((a, b) => a.frame - b.frame);
    renderKeyframes();
    console.log(`Keyframe ajoutée à la frame ${newFrame}`);
}


// Initialisation
renderKeyframes();
updateActorPosition(0); // Position initiale
