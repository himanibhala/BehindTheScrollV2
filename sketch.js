// ------------------------ GLOBALS (Cleaned up) ------------------------
let state = "cover"; 

let btn;             
let numInput;        
let submitBtn;       
let userMinutes = 0;

let interestButtons = [];
let selectedInterests = [];
let maxSelections = 5;
let continueBtn;
let backBtn; 

let video;           
let customFont; 
let clickSound; 
let pixelAssets = []; // Array to hold all 20 pixel images (11-30)

// NEW Result Page Buttons
let restartResultBtn;
let shareResultBtn;

// Transition variables
let slideX = 0;           
let slideSpeedHorizontal = 18; 
let slideXRight = 0;      
let slideSpeedRight = 18;

// Map to link Interest Name (key) to its corresponding loaded image asset (value is the index in pixelAssets)
let interestAssetMap = {
  "Food": 0, "Travel tips": 1, "Memes": 2, "Celebrity updates": 3,
  "News": 4, "Quizzes": 5, "Zodiac signs": 6, "GRWM": 7,
  "Crafts": 8, "Fitness routines": 9, "Affirmations": 10, "Photography": 11,
  "Books": 12, "Makeup": 13, "Fashion": 14, "Art": 15,
  "Tech & gadgets": 16, "Gaming": 17, "Tiktok Dances": 18, "Music": 19
};

// Variables for the scrolling text border
let scrollText = " THE MORE TIME YOU SPEND ON SOCIAL MEDIA, THE MORE THESE INTEREST. - DRIVEN PIXELS SHAPE YOU. ★ DON'T LET THE ‘FOR YOU’ DECIDE FOR YOU. SEE HOW YOUR ALGORITHM SEES YOU. ";
let scrollPhase = 0;

// ------------------------ PRELOAD ------------------------
function preload() {
  // NOTE: Ensure these files are available in your project directory
  customFont = loadFont('Inconsolata_SemiCondensed-ExtraBold.ttf'); 
  clickSound = loadSound('click.mp3'); 
  
  // Load all 20 image assets (pixeldesign-11.png through pixeldesign-30.png)
  for (let i = 11; i <= 30; i++) {
    pixelAssets.push(loadImage(`pixeldesign-${i}.png`));
  }
}

// ------------------------ SETUP ------------------------
function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialize Video (used for result page, kept here for consistency)
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide(); 

  btn = createButton("Start Analysis");
  stylePrimaryButton(btn,'#d8e63c');
  
  btn.mousePressed(() => {
    playClickSound(); 
    if (state === "cover") {
      state = "welcome";  
    } else if (state === "welcome") {
      state = "slideLeft";
      slideX = 0;          
    }
  });
  positionButton();
}

// ------------------------ DRAW ------------------------
function draw() {
  background('#17184b'); 
  
  // Hide all result buttons by default unless state is "result"
  if (restartResultBtn) restartResultBtn.hide();
  if (shareResultBtn) shareResultBtn.hide();

  if (state === "cover") {
    drawCover();
  } else if (state === "welcome") {
    drawWelcome();
  } else if (state === "slideLeft") { 
    drawSlideLeft();
  } else if (state === "slideRight") { 
    drawSlideRight();
  } else if (state === "slate") {
    drawSlate();
  } else if (state === "interests") {
    drawInterestsPage();
  } else if (state === "result") {
    drawResultCamera();
  }

  // Draw Corner Branding on all pages except the cover 
  if (state !== "cover") {
    drawCornerBranding();
  }
}

// ------------------------ SCENES ------------------------

function drawCover() {
  let distFromCenter = dist(mouseX, mouseY, width / 2, height / 2);
  let maxDist = dist(0, 0, width / 2, height / 2);
  let normalizedInput = pow(map(distFromCenter, 0, maxDist, 0, 1), 1.2); 
  
  drawAnimatedGradient(normalizedInput); 

  btn.show();
  if (numInput) numInput.hide();
  if (submitBtn) submitBtn.hide();

  let startY = height / 2 - 100;

  fill('#D3DDE7');
  if (customFont) textFont(customFont); 
  textAlign(CENTER, TOP); 

  textSize(100);
  let newTitle = "[ BEHIND THE SCROLL ]";
  text(newTitle, width / 2, startY-20); 

  textSize(28);
  fill('#D3DDE7');
  if (customFont) textFont(customFont);
  text("A Learning guide about how your social media algorithm works!", width / 2, startY + 90); 

  btn.position((width - btn.width) / 2, startY + 150); 
  btn.html("Start"); 
}

function drawWelcome() {
  drawWelcomeContentBlock();
  
  btn.show();

  if (numInput) numInput.hide();
  if (submitBtn) submitBtn.hide();

  // Center the button
  let startY = height / 2 - 80;
  btn.position((width - btn.width) / 2, startY + 200);
  btn.html("Next");
}

function drawSlideLeft() {
    slideX += slideSpeedHorizontal;
    
    btn.hide();
    if (numInput) numInput.hide();
    if (submitBtn) submitBtn.hide();

    background('#17184b');

    push();
    translate(-slideX, 0); 
    drawWelcomeContentBlock();
    pop();

    push();
    translate(width - slideX, 0); 
    drawSlateContentBlock();
    pop();
    
    if (slideX >= width) {
        state = "slate";
        slideX = 0; 
    }
}

function drawSlideRight() {
    slideXRight += slideSpeedRight;
    
    interestButtons.forEach(b=>b.hide());
    if (continueBtn) continueBtn.hide();

    background('#17184b');
    
    push();
    translate(-slideXRight, 0); 
    drawInterestsContentBlock();
    pop();

    push();
    translate(width - slideXRight, 0); 
    drawSlateContentBlock();
    pop();
    
    if (slideXRight >= width) {
        state = "slate";
        slideXRight = 0; 
    }
}


function drawSlate() {
  background('#17184b');
  
  drawSlateContentBlock();
  
  btn.hide();

  if (!numInput) {
    numInput = createInput('', 'number'); 
    numInput.attribute('min', '1');
    numInput.attribute('max', '500');
    numInput.attribute('placeholder', '1 - 500');
    numInput.size(120);
    numInput.style('font-size', '18px');
    numInput.style('padding', '6px 12px');
    numInput.style('border', '2px solid #D8E63C');
    numInput.style('border-radius', '12px');
    numInput.style('background-color', '#17184b');
    numInput.style('font-family', 'Inconsolata_SemiCondensed-ExtraBold'); 
    numInput.style('color', '#D3DDE7');
    numInput.position((width/2) - 60, (height/2) + 10);
  } else numInput.show();

  if (!submitBtn) {
    submitBtn = createButton('Submit');
    stylePrimaryButton(submitBtn,'#d8e63c');
    submitBtn.mousePressed(() => {
        playClickSound(); 
        handleSubmit();
    });
    submitBtn.position((width/2) - 30, (height/2) + 60);
  } else submitBtn.show();
}

function drawInterestsPage() {
  background('#17184b');
  
  drawInterestsContentBlock();

  if (numInput) numInput.hide();
  if (submitBtn) submitBtn.hide();
  if (btn) btn.hide();
  
  createOrUpdateInterestButtons();
}

function drawResultCamera() {
  background('#17184b');
  
  if (!video) {
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();
  }
  
  // --- Video Positioning and Scaling ---
  let targetScale = 0.70; 
  let targetWidth = width * targetScale;
  let targetHeight = height * targetScale;
  
  let targetAspect = targetWidth / targetHeight;
  let videoAspect = video.width / video.height;
  let videoWidth, videoHeight;
  let videoX, videoY;

  // Calculate Video size using the "Contain" method 
  if (videoAspect > targetAspect) {
    videoWidth = targetWidth;
    videoHeight = targetWidth / videoAspect;
  } else {
    videoHeight = targetHeight;
    videoWidth = targetHeight * videoAspect;
  }
  
  // CENTER THE VIDEO EXACTLY
  videoX = (width - videoWidth) / 2; 
  videoY = (height - videoHeight) / 2; 

  // --- Pixelation and Drawing Logic ---
  let minutes = constrain(userMinutes,1,500);
  let t=(minutes-1)/(500-1);
  let tCurved=pow(t,1.25);
  let pxSize = lerp(48,2,tCurved);
  pxSize = max(1,floor(pxSize));

  push();
  translate(videoX,videoY);
  let scaleW = videoWidth/video.width;
  let scaleH = videoHeight/video.height;
  video.loadPixels();
  noStroke();

  for(let sy=0; sy<video.height; sy+=pxSize){
    for(let sx=0; sx<video.width; sx+=pxSize){
      let i=(sy*video.width+sx)*4;
      let r=video.pixels[i], g=video.pixels[i+1], b=video.pixels[i+2];
      let dx=sx*scaleW, dy=sy*scaleH, dW=pxSize*scaleW, dH=pxSize*scaleH;
      let drawX = videoWidth - dx - dW, drawY=dy; // Draw flipped horizontally for mirror effect

      if (pixelAssets.length === 20) { 
          let bright = (r + g + b) / 3;
          
          let selectedInterestIndex = floor(map(bright, 0, 255, 0, selectedInterests.length));
          selectedInterestIndex = constrain(selectedInterestIndex, 0, selectedInterests.length - 1);
          
          let chosenInterestName = selectedInterests[selectedInterestIndex];
          let assetIndex = interestAssetMap[chosenInterestName];
          let chosenAsset = pixelAssets[assetIndex];

          let assetSize = min(dW, dH) * 0.95; 
          
          image(
            chosenAsset, 
            drawX + dW / 2 - assetSize / 2, 
            drawY + dH / 2 - assetSize / 2, 
            assetSize, 
            assetSize
          );
      }
    }
  }
  pop();
  
  // Draw the scrolling text border around the result area
  drawTextBorder(videoX, videoY, videoWidth, videoHeight);

  if (numInput) numInput.hide();
  if (submitBtn) submitBtn.hide();
  if (btn) btn.hide();
  interestButtons.forEach(b=>b.hide());
  if (continueBtn) continueBtn.hide();


  // --- NEW: RESTART AND SHARE BUTTONS ---

  let btnW = 150;
  let gap = 20;
  let totalW = btnW * 2 + gap;
  let startX = width / 2 - totalW / 2;
  let btnY = height - 60;
  
  // 1. Share Image Button
  if (!shareResultBtn) {
      shareResultBtn = createButton('Click Image');
      stylePrimaryButton(shareResultBtn, '#D6B4FC');
      shareResultBtn.size(btnW, 40);
      shareResultBtn.mousePressed(() => {
          playClickSound();
          // Capture the image area (video + text border) for sharing
          let capturePadding = 35;
          let receiptImage = get(
              videoX - capturePadding, 
              videoY - capturePadding, 
              videoWidth + capturePadding * 2, 
              videoHeight + capturePadding * 2
          );
          handleWebShare(receiptImage); 
      });
  }

  // 2. Restart Button
  if (!restartResultBtn) {
      restartResultBtn = createButton('Restart');
      stylePrimaryButton(restartResultBtn, '#D8E63C');
      restartResultBtn.size(btnW, 40);
      restartResultBtn.mousePressed(() => {
          playClickSound(); 
          state = "cover";
          userMinutes = 0;
          selectedInterests = [];
          if (video) { video.remove(); video = null; } // Remove video element
          if (restartResultBtn) restartResultBtn.hide();
          if (shareResultBtn) shareResultBtn.hide();
      });
  }
  
  // Position and show the new buttons
  shareResultBtn.position(startX, btnY);
  restartResultBtn.position(startX + btnW + gap, btnY);

  shareResultBtn.show();
  restartResultBtn.show();
}

// ------------------------ HELPER FUNCTIONS ------------------------

function playClickSound() {
    if (clickSound && clickSound.isLoaded()) {
      if (clickSound.isPlaying()) {
        clickSound.stop();
      }
      clickSound.play();
    }
}

function drawCornerBranding() {
  if (customFont) textFont(customFont);
  textSize(24);
  fill('#D3DDE7'); 
  textAlign(LEFT, TOP);
  
  text("[ BEHIND THE SCROLL ]", 20, 20); 
}

function drawTypingWelcome(blockX, startY) {
  if (customFont) textFont(customFont); 
  textAlign(CENTER, TOP); // ALIGNED TO CENTER

  fill('#D3DDE7');
  textSize(64);
  text("Did you Know?", width / 2, startY); // Using width / 2

  fill('#D3DDE7'); 
  textSize(28);
  // Using width/2 with center alignment will center the text lines relative to the screen.
  text("Algorithms often show you more of what you already like, \nso you might be seeing a filtered version of the world without even noticing. \nReady to see how your feed sees you? Let’s test it out.", width / 2, startY + 80); // Using width / 2
}

function drawWelcomeContentBlock() {
  let blockWidth = 600; 
  let blockX = (width - blockWidth) / 2;
  let startY = height / 2 - 80;

  fill('#17184b'); 
  rect(0, startY - 30, width, height);

  drawTypingWelcome(blockX, startY);
}

function drawSlateContentBlock() {
    if (customFont) textFont(customFont); 
    textAlign(CENTER, CENTER);
    textSize(28);
    fill('#D3DDE7');
    text("How many minutes do you spend on social media daily?", width/2, height/2 - 40);
}

function drawInterestsContentBlock() {
    if (customFont) textFont(customFont); 
    textAlign(CENTER, TOP);
    textSize(48);
    fill('#D3DDE7');
    
    const cols = 5;
    const rows = 4;
    const headingHeight = 48; 
    const headingPadding = 40; 
    const buttonHeight = 40;
    const gapY = 18;
    const continueButtonHeight = 40;
    const continueButtonGap = 18;
    
    const totalGridHeight = rows * (buttonHeight + gapY) - gapY;
    
    let totalContentHeight = headingHeight + headingPadding + totalGridHeight + continueButtonGap + continueButtonHeight;
    let topY = (height - totalContentHeight) / 2;
    topY = max(40, topY);

    text("Select 5 of your interests:", width / 2, topY - 25);
}

function drawAnimatedGradient(input) { 
  noStroke();
  
  let colorA = color('#17184b');     
  let colorB = color('#D6B4FC');   // Lilac color
  let colorC = color(216, 230, 60);  
  
  let dynamicColorB = lerpColor(colorB, colorC, input);

  let center = { x: width / 2, y: height / 2 };
  let maxRadius = dist(0, 0, center.x, center.y); 
  let step = 2; 
  
  for (let r = maxRadius; r >= 0; r -= step) {
    let inter = map(r, 0, maxRadius, 0, 1); 
    
    let currentInter = map(inter, 0, 1, 0, 1 + input * 0.5); 
    currentInter = constrain(currentInter, 0, 1);
    
    let c = lerpColor(dynamicColorB, colorA, currentInter);
    
    fill(c); 
    
    ellipse(center.x, center.y, r * 2, r * 2);
  }
}

function handleSubmit(){
  if(!numInput) return;
  let raw=numInput.value();
  if(raw===''||raw===null){
      console.error("Please enter a number 1-500."); 
      return;
  }
  let n=Number(raw); 
  if(isNaN(n)) {
      console.error("Invalid number"); 
      return;
  }
  userMinutes = constrain(n,1,500);
  state="interests";
}

function toggleInterest(name, button){
  playClickSound(); 
  let idx=selectedInterests.indexOf(name);
  if(idx>-1){ selectedInterests.splice(idx,1); button.style('background-color','#D3DDE7'); }
  else if(selectedInterests.length<maxSelections){ selectedInterests.push(name); button.style('background-color','#D6B4FC'); } 
  else{ 
      console.error(`Only ${maxSelections} interests allowed.`); 
  }
}

function createOrUpdateInterestButtons() {
  const interests = Object.keys(interestAssetMap); 

  const cols = 5;
  const rows = 4;
  
  let gapX = Math.max(12, width*0.02);
  let buttonWidth = Math.min(180, (width - gapX*(cols+1))/cols);
  let buttonHeight = 40;
  let startX = (width - (buttonWidth*cols + gapX*(cols-1)))/2;
  
  let gapY = 18;

  // VERTICAL CENTER CALCULATIONS (MATCHING drawInterestsContentBlock) 
  const headingHeight = 48; 
  const headingPadding = 40; 
  
  const totalGridHeight = rows * (buttonHeight + gapY) - gapY;
  
  let buttonGridYStart = (height - totalGridHeight) / 2 - 20;
  buttonGridYStart = max(40 + headingHeight + headingPadding, buttonGridYStart);
  
  if (interestButtons.length === 0) {
    for (let i = 0; i < interests.length; i++) {
      let b = createButton(interests[i]);
      stylePrimaryButton(b,'#D3DDE7');
      b.style('color','#17184b'); 
      b.style('font-family', 'Inconsolata_SemiCondensed-ExtraBold'); 
      b._interestName = interests[i];
      b.mousePressed(()=> toggleInterest(b._interestName, b));
      interestButtons.push(b);
    }
  }

  for (let i = 0; i < interestButtons.length; i++) {
    let col = i % cols;
    let row = Math.floor(i/cols);
    let x = startX + col*(buttonWidth + gapX);
    let y = buttonGridYStart + row*(buttonHeight + gapY); 
    let b = interestButtons[i];
    b.position(Math.round(x), Math.round(y));
    b.size(Math.round(buttonWidth), Math.round(buttonHeight));
    b.style('background-color', selectedInterests.indexOf(b._interestName)>-1?'#D6B4FC':'#D3DDE7');
    b.show();
  }

  let continueY = buttonGridYStart + rows*(buttonHeight+gapY) + 18; 
  if (!continueBtn) {
    continueBtn = createButton('Continue');
    stylePrimaryButton(continueBtn,'#d8e63c');
    continueBtn.mousePressed(()=>{
      playClickSound(); 
      if(selectedInterests.length===maxSelections) {
          state="result";
          interestButtons.forEach(b=>b.hide()); 
          if (continueBtn) continueBtn.hide();
      }
      else {
          console.error(`Please select exactly ${maxSelections} interests.`);
      }
    });
  }
  continueBtn.position(Math.round((width-continueBtn.size().width)/2), Math.round(continueY));
  continueBtn.show();
}

function positionButton(){
  if(!btn) return;
  btn.position((windowWidth-btn.width)/2,windowHeight/2+40); 
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
  positionButton();
  if(interestButtons.length>0) createOrUpdateInterestButtons(); 
  if(numInput&&state==="slate"){ numInput.position((width/2)-60,(height/2)+10); submitBtn.position((width/2)-30,(height/2)+60);}
}

function stylePrimaryButton(b,color){
  b.style('background-color',color);
  let textColor = (color === '#D6B4FC') ? '#17184b' : 'white'; 
  b.style('color', textColor);
  b.style('font-size','18px');
  b.style('font-family', 'Inconsolata_SemiCondensed-ExtraBold'); 
  b.style('padding','10px 20px');
  b.style('border','none');
  b.style('border-radius','10px');
  b.style('cursor','pointer');
}

function drawTextBorder(videoX, videoY, videoWidth, videoHeight) {
  push();
  fill('#D8E63C'); // Bright yellow/green color
  textFont(customFont);
  textAlign(CENTER, CENTER);
  
  scrollPhase = (scrollPhase + 0.1) % scrollText.length; 
  
  const textBorderOffset = 25; 
  
  let baseSize = 16;
  textSize(baseSize);

  let perimeter = 2 * (videoWidth + videoHeight);
  let charSpacing = 12; 
  let numCharacters = floor(perimeter / charSpacing) + 2; 
  
  for (let i = 0; i < numCharacters; i++) {
    let charIndex = floor(i + scrollPhase) % scrollText.length;
    let charToDraw = scrollText.charAt(charIndex);
    
    let distance = i * charSpacing;
    let x = 0, y = 0;
    let angle = 0; 
    let offsetX = 0, offsetY = 0; 

    if (distance < videoWidth) {
      // Top edge
      x = videoX + distance;
      y = videoY;
      angle = 0; 
      offsetY = -textBorderOffset; 
    } else if (distance < videoWidth + videoHeight) {
      // Right edge
      x = videoX + videoWidth;
      y = videoY + (distance - videoWidth);
      angle = HALF_PI; 
      offsetX = textBorderOffset; 
    } else if (distance < 2 * videoWidth + videoHeight) {
      // Bottom edge
      x = videoX + videoWidth - (distance - videoWidth - videoHeight);
      y = videoY + videoHeight;
      angle = PI; 
      offsetY = textBorderOffset; 
    } else {
      // Left edge
      x = videoX;
      y = videoY + videoHeight - (distance - 2 * videoWidth - videoHeight);
      angle = -HALF_PI; 
      offsetX = -textBorderOffset; 
    }
    
    push();
    translate(x, y);
    
    translate(offsetX, offsetY); 

    rotate(angle);
    text(charToDraw, 0, 0);
    pop();
  }
  pop();
}

// ------------------------ NATIVE SHARE API FUNCTIONS ------------------------

async function convertCanvasToBlob(p5Image) {
    return new Promise((resolve, reject) => {
        if (p5Image.canvas) {
            p5Image.canvas.toBlob(resolve, 'image/png');
        } else {
            reject(new Error("Cannot find canvas element for sharing."));
        }
    });
}

async function handleWebShare(p5Image) {
    if (navigator.share && navigator.canShare && p5Image) {
        
        try {
            const blob = await convertCanvasToBlob(p5Image);
            const file = new File([blob], 'DigitalMirrorSelfie.png', { type: 'image/png' });

            if (navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'My Digital Mirror Selfie',
                    text: 'This is my Digital Mirror Selfie from [BEHIND THE SCROLL]!',
                });
            } else {
                console.error("File sharing is not supported on this device's native menu.");
                // NOTE: Using a console error instead of alert as per instructions
            }
        } catch (error) {
            console.log('Sharing failed or cancelled:', error);
            if (error.name !== 'AbortError') { 
                // NOTE: Using console.error instead of alert as per instructions
                console.error("Sharing failed. Please check device settings or try again.");
            }
        }
    } else {
        // NOTE: Using console.error instead of alert as per instructions
        console.error("Native sharing is not supported on this browser. You can still right-click or long-press the image to save it.");
    }
}
