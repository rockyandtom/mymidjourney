// Using Firebase as a backend service
// First, we need to add the Firebase SDK
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    const app = {
        // Mock data, in a real project this would be loaded from Firebase or another backend
        images: [
            {
                id: 'img1',
                url: 'https://source.unsplash.com/random/800x600?fantasy,art',
                prompt: 'A cyberpunk cityscape with neon lights, flying cars, futuristic buildings, cinematic lighting, 8k resolution, detailed, Midjourney v5',
                likes: 256,
                timestamp: new Date('2023-05-10').getTime()
            },
            {
                id: 'img2',
                url: 'https://source.unsplash.com/random/800x800?portrait,fantasy',
                prompt: 'Portrait of an ethereal elf with silver hair, forest background, intricate details, fantasy style, magical aura, high definition, Midjourney v5',
                likes: 178,
                timestamp: new Date('2023-05-15').getTime()
            },
            {
                id: 'img3',
                url: 'https://source.unsplash.com/random/900x600?futuristic,architecture',
                prompt: 'Futuristic alien temple, ancient yet advanced, mysterious glowing symbols, otherworldly atmosphere, hyper detailed, Midjourney v5',
                likes: 129,
                timestamp: new Date('2023-05-20').getTime()
            },
            {
                id: 'img4',
                url: 'https://source.unsplash.com/random/600x900?food,fantasy',
                prompt: 'Magical feast with glowing potions, fantastical fruits, dragon-cooked meats, on an elvish table, detailed food photography, Midjourney v5',
                likes: 95,
                timestamp: new Date('2023-05-25').getTime()
            },
            {
                id: 'img5',
                url: 'https://source.unsplash.com/random/800x600?robot,scifi',
                prompt: 'Biomechanical being half human half machine, intricate details, cyberpunk aesthetic, studio lighting, 8k rendering, Midjourney v5',
                likes: 84,
                timestamp: new Date('2023-05-30').getTime()
            },
            {
                id: 'img6',
                url: 'https://source.unsplash.com/random/600x800?abstract,space',
                prompt: 'Cosmic nebula birth of stars, vibrant colors, swirling gases, deep space, astronomical photography, extremely detailed, Midjourney v5',
                likes: 62,
                timestamp: new Date('2023-06-05').getTime()
            }
        ],
        currentSort: 'popular',
        currentSearch: '',
        currentPage: 1,
        imagesPerPage: 12,
        darkMode: false,
        init: function() {
            this.initDarkMode();
            this.renderGallery();
            this.bindEvents();
        },
        initDarkMode: function() {
            // Check user preference
            if (localStorage.getItem('darkMode') === 'true' || 
                (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && 
                localStorage.getItem('darkMode') !== 'false')) {
                document.documentElement.classList.add('dark');
                this.darkMode = true;
            }
        },
        bindEvents: function() {
            // Theme toggle
            document.getElementById('theme-toggle').addEventListener('click', this.toggleDarkMode.bind(this));
            
            // Upload related
            document.getElementById('upload-button').addEventListener('click', this.openUploadModal.bind(this));
            document.getElementById('close-upload-modal').addEventListener('click', this.closeUploadModal.bind(this));
            document.getElementById('cancel-upload').addEventListener('click', this.closeUploadModal.bind(this));
            document.getElementById('dropzone').addEventListener('click', this.triggerFileInput.bind(this));
            document.getElementById('file-input').addEventListener('change', this.handleFileSelect.bind(this));
            document.getElementById('upload-form').addEventListener('submit', this.handleUpload.bind(this));
            
            // Drag and drop upload
            const dropzone = document.getElementById('dropzone');
            dropzone.addEventListener('dragover', this.handleDragOver.bind(this));
            dropzone.addEventListener('dragleave', this.handleDragLeave.bind(this));
            dropzone.addEventListener('drop', this.handleDrop.bind(this));
            
            // Detail modal
            document.getElementById('close-detail-modal').addEventListener('click', this.closeDetailModal.bind(this));
            document.getElementById('detail-like-button').addEventListener('click', this.handleDetailLike.bind(this));
            document.getElementById('detail-download-button').addEventListener('click', this.handleDetailDownload.bind(this));
            
            // Search and sort
            document.getElementById('search-input').addEventListener('input', this.handleSearch.bind(this));
            document.getElementById('sort-select').addEventListener('change', this.handleSort.bind(this));
            
            // Load more
            document.getElementById('load-more').addEventListener('click', this.loadMore.bind(this));
        },
        renderGallery: function() {
            const gallery = document.getElementById('gallery');
            gallery.innerHTML = '';
            
            // Filter and sort images
            let filteredImages = this.filterImages();
            let sortedImages = this.sortImages(filteredImages);
            
            // Pagination
            const startIndex = 0;
            const endIndex = this.currentPage * this.imagesPerPage;
            const paginated = sortedImages.slice(startIndex, endIndex);
            
            // Hide or show load more button
            document.getElementById('load-more').style.display = 
                endIndex >= sortedImages.length ? 'none' : 'inline-block';
            
            // Create image cards
            paginated.forEach(image => {
                const card = this.createImageCard(image);
                gallery.appendChild(card);
            });
        },
        createImageCard: function(image) {
            const card = document.createElement('div');
            card.className = 'break-inside-avoid mb-4 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow';
            card.dataset.id = image.id;
            
            // Image container
            const imgContainer = document.createElement('div');
            imgContainer.className = 'relative overflow-hidden';
            
            // Image
            const img = document.createElement('img');
            img.src = image.url;
            img.alt = 'Midjourney Generated Image';
            img.className = 'w-full h-auto cursor-pointer';
            img.addEventListener('click', () => this.openDetailModal(image));
            
            // Prompt preview
            const promptPreview = document.createElement('div');
            promptPreview.className = 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white opacity-0 hover:opacity-100 transition-opacity';
            
            const promptText = document.createElement('p');
            promptText.className = 'text-sm line-clamp-2';
            promptText.textContent = image.prompt;
            promptPreview.appendChild(promptText);
            
            imgContainer.appendChild(img);
            imgContainer.appendChild(promptPreview);
            
            // Card footer
            const cardFooter = document.createElement('div');
            cardFooter.className = 'p-3 flex justify-between items-center';
            
            // Like button
            const likeButton = document.createElement('button');
            likeButton.className = 'flex items-center space-x-1 text-gray-500 hover:text-red-500';
            likeButton.innerHTML = `
                <i class="far fa-heart"></i>
                <span>${image.likes}</span>
            `;
            likeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleLike(image.id);
            });
            
            // Download button
            const downloadButton = document.createElement('button');
            downloadButton.className = 'text-gray-500 hover:text-primary-500';
            downloadButton.innerHTML = '<i class="fas fa-download"></i>';
            downloadButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleDownload(image);
            });
            
            cardFooter.appendChild(likeButton);
            cardFooter.appendChild(downloadButton);
            
            // Assemble card
            card.appendChild(imgContainer);
            card.appendChild(cardFooter);
            
            return card;
        },
        filterImages: function() {
            if (!this.currentSearch) return this.images;
            
            const search = this.currentSearch.toLowerCase();
            return this.images.filter(image => 
                image.prompt.toLowerCase().includes(search)
            );
        },
        sortImages: function(images) {
            const sorted = [...images];
            if (this.currentSort === 'popular') {
                sorted.sort((a, b) => b.likes - a.likes);
            } else if (this.currentSort === 'newest') {
                sorted.sort((a, b) => b.timestamp - a.timestamp);
            }
            return sorted;
        },
        handleSearch: function(e) {
            this.currentSearch = e.target.value;
            this.currentPage = 1;
            this.renderGallery();
        },
        handleSort: function(e) {
            this.currentSort = e.target.value;
            this.renderGallery();
        },
        loadMore: function() {
            this.currentPage++;
            this.renderGallery();
        },
        toggleDarkMode: function() {
            document.documentElement.classList.toggle('dark');
            this.darkMode = !this.darkMode;
            localStorage.setItem('darkMode', this.darkMode);
        },
        openUploadModal: function() {
            document.getElementById('upload-modal').classList.remove('hidden');
            document.getElementById('upload-form').reset();
            document.getElementById('preview-container').classList.add('hidden');
            document.getElementById('upload-prompt').classList.remove('hidden');
        },
        closeUploadModal: function() {
            document.getElementById('upload-modal').classList.add('hidden');
        },
        triggerFileInput: function() {
            document.getElementById('file-input').click();
        },
        handleFileSelect: function(e) {
            const file = e.target.files[0];
            if (file) {
                this.previewImage(file);
            }
        },
        handleDragOver: function(e) {
            e.preventDefault();
            e.stopPropagation();
            document.getElementById('dropzone').classList.add('border-primary-500');
        },
        handleDragLeave: function(e) {
            e.preventDefault();
            e.stopPropagation();
            document.getElementById('dropzone').classList.remove('border-primary-500');
        },
        handleDrop: function(e) {
            e.preventDefault();
            e.stopPropagation();
            document.getElementById('dropzone').classList.remove('border-primary-500');
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                document.getElementById('file-input').files = e.dataTransfer.files;
                this.previewImage(file);
            }
        },
        previewImage: function(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('image-preview');
                preview.src = e.target.result;
                document.getElementById('preview-container').classList.remove('hidden');
                document.getElementById('upload-prompt').classList.add('hidden');
            };
            reader.readAsDataURL(file);
        },
        handleUpload: function(e) {
            e.preventDefault();
            
            const fileInput = document.getElementById('file-input');
            const promptInput = document.getElementById('prompt-input');
            
            if (!fileInput.files[0] || !promptInput.value.trim()) {
                alert('Please select an image and enter a prompt');
                return;
            }
            
            // In a real project, we would call an API to upload the image and prompt
            // In this demo, we simulate adding to local data
            const newImage = {
                id: 'img' + (this.images.length + 1),
                url: URL.createObjectURL(fileInput.files[0]),
                prompt: promptInput.value.trim(),
                likes: 0,
                timestamp: Date.now()
            };
            
            this.images.unshift(newImage);
            this.currentPage = 1;
            this.renderGallery();
            this.closeUploadModal();
        },
        openDetailModal: function(image) {
            const modal = document.getElementById('image-detail-modal');
            const detailImage = document.getElementById('detail-image');
            const detailPrompt = document.getElementById('detail-prompt');
            const detailLikesCount = document.getElementById('detail-likes-count');
            const detailDate = document.getElementById('detail-date');
            
            detailImage.src = image.url;
            detailPrompt.textContent = image.prompt;
            detailLikesCount.textContent = image.likes;
            detailDate.textContent = new Date(image.timestamp).toLocaleDateString();
            
            // Store current image ID for like and download operations
            modal.dataset.imageId = image.id;
            
            modal.classList.remove('hidden');
        },
        closeDetailModal: function() {
            document.getElementById('image-detail-modal').classList.add('hidden');
        },
        handleLike: function(imageId) {
            const image = this.images.find(img => img.id === imageId);
            if (image) {
                // In a real project, we would call an API to increase the likes count
                // In this demo, we directly modify the local data
                image.likes++;
                this.renderGallery();
            }
        },
        handleDetailLike: function() {
            const modal = document.getElementById('image-detail-modal');
            const imageId = modal.dataset.imageId;
            const likesCount = document.getElementById('detail-likes-count');
            
            const image = this.images.find(img => img.id === imageId);
            if (image) {
                image.likes++;
                likesCount.textContent = image.likes;
            }
        },
        handleDownload: function(image) {
            // In a real project, this would be a real download link
            // In this demo, we use an a tag to simulate download
            const a = document.createElement('a');
            a.href = image.url;
            a.download = 'midjourney-' + image.id + '.jpg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },
        handleDetailDownload: function() {
            const modal = document.getElementById('image-detail-modal');
            const imageId = modal.dataset.imageId;
            
            const image = this.images.find(img => img.id === imageId);
            if (image) {
                this.handleDownload(image);
            }
        }
    };
    
    // Initialize the application
    app.init();
}); 