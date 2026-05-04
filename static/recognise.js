class AIFashionAnalyzer {
    constructor() {
        this.currentImage = null;
        this.stream = null;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Upload events
        const uploadBtn = document.getElementById('uploadBtn');
        const imageUpload = document.getElementById('imageUpload');
        const uploadArea = document.getElementById('uploadArea');

        uploadBtn.addEventListener('click', () => imageUpload.click());
        uploadArea.addEventListener('click', () => imageUpload.click());
        imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));

        // Webcam events
        document.getElementById('webcamBtn').addEventListener('click', () => this.startWebcam());
        document.getElementById('captureBtn').addEventListener('click', () => this.capturePhoto());
        document.getElementById('retakeBtn').addEventListener('click', () => this.retakePhoto());

        // Analyze button
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeStyle());
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.currentImage = e.target.result;
                this.showImagePreview(e.target.result);
                this.setAnalyzeButtonState(true);
                this.hideWebcamElements();
            };
            reader.readAsDataURL(file);
        }
    }

    async startWebcam() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480, facingMode: 'user' } 
            });
            
            const video = document.getElementById('video');
            video.srcObject = this.stream;
            video.hidden = false;
            video.play();
            
            document.getElementById('webcamBtn').hidden = true;
            document.getElementById('captureBtn').hidden = false;
            document.getElementById('webcamPreview').classList.add('hidden');
            
            this.hideUploadElements();
        } catch (err) {
            console.error('Error accessing webcam:', err);
            alert('Could not access webcam. Please check permissions and try again.');
        }
    }

    capturePhoto() {
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        this.currentImage = canvas.toDataURL('image/jpeg', 0.9);
        this.showImagePreview(this.currentImage);
        this.setAnalyzeButtonState(true);
        
        this.stopWebcam();
        this.showCapturedPreview();
    }

    retakePhoto() {
        document.getElementById('capturedImage').hidden = true;
        document.getElementById('retakeBtn').hidden = true;
        document.getElementById('webcamPreview').classList.add('hidden');
        document.getElementById('webcamBtn').hidden = false;
        document.getElementById('captureBtn').hidden = true;
        this.currentImage = null;
        this.setAnalyzeButtonState(false);
        this.showUploadElements();
    }

    showImagePreview(imageData) {
        const previewImg = document.getElementById('capturedImage');
        previewImg.src = imageData;
        previewImg.hidden = false;
    }

    showCapturedPreview() {
        document.getElementById('webcamPreview').classList.remove('hidden');
        document.getElementById('retakeBtn').hidden = false;
    }

    stopWebcam() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        document.getElementById('video').pause();
        document.getElementById('video').hidden = true;
    }

    hideUploadElements() {
        document.querySelector('.upload-section').style.opacity = '0.5';
        document.querySelector('.upload-section').style.pointerEvents = 'none';
    }

    showUploadElements() {
        document.querySelector('.upload-section').style.opacity = '1';
        document.querySelector('.upload-section').style.pointerEvents = 'auto';
    }

    hideWebcamElements() {
        document.querySelector('.webcam-section').style.opacity = '0.5';
        document.querySelector('.webcam-section').style.pointerEvents = 'none';
    }

    setAnalyzeButtonState(enabled) {
        const analyzeBtn = document.getElementById('analyzeBtn');
        analyzeBtn.disabled = !enabled;
        if (enabled) {
            analyzeBtn.style.opacity = '1';
        } else {
            analyzeBtn.style.opacity = '0.5';
        }
    }

    analyzeStyle() {
        if (!this.currentImage) return;

        // Show loading state
        document.getElementById('analyzeBtn').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        document.getElementById('analyzeBtn').disabled = true;

        // Show results section
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.classList.remove('hidden');

        // Set the analyzed image
        document.getElementById('resultImage').src = this.currentImage;

        // Simulate AI analysis with realistic results (demo data)
        setTimeout(() => {
            this.displayResults();
            document.getElementById('analyzeBtn').innerHTML = '<i class="fas fa-brain"></i> Analyze My Style';
        }, 3000);
    }

    displayResults() {
        // Demo results - in real implementation, this would come from AI backend
        const demoResults = {
            gender: ['Female', 'Male', 'Non-binary'][Math.floor(Math.random() * 3)],
            faceShape: ['Oval', 'Round', 'Square', 'Heart', 'Diamond'][Math.floor(Math.random() * 5)],
            skinTone: ['Warm', 'Cool', 'Neutral'][Math.floor(Math.random() * 3)],
            bodyType: ['Hourglass', 'Pear', 'Apple', 'Rectangle', 'Inverted Triangle'][Math.floor(Math.random() * 5)]
        };

        // Set basic results
        document.getElementById('genderResult').textContent = demoResults.gender;
        document.getElementById('faceShapeResult').textContent = demoResults.faceShape;
        document.getElementById('skinToneResult').textContent = demoResults.skinTone;
        document.getElementById('bodyTypeResult').textContent = demoResults.bodyType;

        // Generate clothing recommendations based on analysis
        const clothesRecs = this.generateClothingRecommendations(demoResults);
        const accessoriesRecs = this.generateAccessoryRecommendations(demoResults);

        document.getElementById('clothesRecommendations').innerHTML = 
            clothesRecs.map(item => `<span>${item}</span>`).join('');
        document.getElementById('accessoriesRecommendations').innerHTML = 
            accessoriesRecs.map(item => `<span>${item}</span>`).join('');
    }

    generateClothingRecommendations(results) {
        const recs = {
            faceShape: {
                'Oval': ['V-neck tops', 'Most styles work well'],
                'Round': ['V-necklines', 'Angular jackets'],
                'Square': ['Soft rounded necklines', 'Flowy blouses'],
                'Heart': ['V-necks', 'Scoops'],
                'Diamond': ['High necklines', 'Off-shoulder']
            },
            bodyType: {
                'Hourglass': ['Fitted dresses', 'Wrap dresses', 'Belted tops'],
                'Pear': ['A-line skirts', 'Empire waist dresses', 'Wide-leg pants'],
                'Apple': ['A-line dresses', 'Flowy tunics', 'V-neck tops'],
                'Rectangle': ['Peplum tops', 'Ruffles', 'Structured jackets'],
                'Inverted Triangle': ['Peplum', 'Full skirts', 'Wide-leg pants']
            }
        };

        let recommendations = [];
        if (recs.faceShape[results.faceShape]) {
            recommendations.push(...recs.faceShape[results.faceShape]);
        }
        if (recs.bodyType[results.bodyType]) {
            recommendations.push(...recs.bodyType[results.bodyType]);
        }

        return recommendations.slice(0, 6);
    }

    generateAccessoryRecommendations(results) {
        const recs = [
            'Statement earrings',
            'Layered necklaces',
            'Hoop earrings',
            'Choker necklaces',
            'Bold cuffs',
            'Stackable rings'
        ];
        return recs.slice(0, 4);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIFashionAnalyzer();
});

// Smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.upload-card, .webcam-card, .results-container').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

document.getElementById("analayzeBtnId").addEventListener("click", async()=>{
    const fileinput=document.getElementById("imageUpload");
    const file= fileinput.files[0];

    const formData= new formData();
    formData.append("image",file);

    const response= await fetch("analyze",{
        method:"POST",
        body: formData
    })

    const data= await response.json();
    console.log(data);
})