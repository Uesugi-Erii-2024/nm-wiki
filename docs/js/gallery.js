// docs/js/gallery.js
class MkDocsGallery {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`找不到容器: ${containerId}`);
      return;
    }
    
    // 默认配置
    this.config = {
      folderPath: "images/team/",  // 默认图片文件夹路径
      imageSize: "200px",          // 图片高度
      fileTypes: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
      lazyLoad: true,
      gap: "15px",
      ...options
    };
    
    // 初始化画廊
    this.init();
  }
  
  async init() {
    try {
      // 创建容器结构
      this.container.innerHTML = `
        <div class="gallery-container" style="display: flex; flex-wrap: wrap; gap: ${this.config.gap}; justify-content: center;"></div>
      `;
      
      this.galleryContainer = this.container.querySelector('.gallery-container');
      
      // 加载图片
      await this.loadImages();
    } catch (error) {
      console.error("画廊初始化失败:", error);
      this.container.innerHTML = `<p>画廊初始化失败: ${error.message}</p>`;
    }
  }
  
  async loadImages() {
    try {
      // 显示加载状态
      this.galleryContainer.innerHTML = "<p>加载图片中...</p>";
      
      // 获取图片列表
      const images = await this.getImageList();
      
      // 清空容器并显示图片
      this.galleryContainer.innerHTML = "";
      
      // 如果没有图片显示提示
      if (images.length === 0) {
        this.galleryContainer.innerHTML = `<p>未找到图片文件 (路径: ${this.config.folderPath})</p>`;
        return;
      }
      
      images.forEach(img => {
        const imgElement = document.createElement('img');
        
        // 使用绝对路径（以斜杠开头）
        imgElement.src = '/' + img; // 关键修改
        
        imgElement.alt = img.split('/').pop();
        imgElement.style.height = this.config.imageSize;
        imgElement.style.margin = "5px";
        imgElement.style.objectFit = "cover";
        imgElement.style.cursor = "pointer";
        imgElement.style.transition = "transform 0.3s";
        imgElement.style.border = "1px solid #eee";
        
        if (this.config.lazyLoad) {
          imgElement.loading = "lazy";
        }
        
        // 添加错误处理
        imgElement.onerror = () => {
          console.error(`图片加载失败: ${imgElement.src}`);
          imgElement.style.border = "2px solid red";
          imgElement.alt = `图片加载失败: ${img}`;
        };
        
        // 添加悬停效果
        imgElement.addEventListener('mouseenter', () => {
          imgElement.style.transform = "scale(1.05)";
          imgElement.style.zIndex = "10";
        });
        
        imgElement.addEventListener('mouseleave', () => {
          imgElement.style.transform = "scale(1)";
          imgElement.style.zIndex = "1";
        });
        
        this.galleryContainer.appendChild(imgElement);
      });
      
    } catch (error) {
      console.error("加载图片失败:", error);
      this.galleryContainer.innerHTML = `<p>图片加载失败: ${error.message}</p>`;
    }
  }
  
  async getImageList() {
    try {
      // 获取文件列表
      const response = await fetch('/file-list.json');
      
      if (!response.ok) {
        throw new Error(`无法获取文件列表: ${response.status} ${response.statusText}`);
      }
      
      const fileList = await response.json();
      
      // 过滤出指定目录中的图片
      const folderPath = this.config.folderPath;
      const images = fileList.filter(file => 
        file.startsWith(folderPath) && 
        this.config.fileTypes.some(ext => file.toLowerCase().endsWith(ext))
      );
      
      console.log("找到的图片:", images);
      
      // 如果没有找到图片，尝试修复路径问题
      if (images.length === 0) {
        console.warn("未找到图片，尝试修复路径...");
        
        // 尝试添加缺失的斜杠
        const fixedPath = folderPath.endsWith('/') ? folderPath : folderPath + '/';
        if (fixedPath !== folderPath) {
          return fileList.filter(file => 
            file.startsWith(fixedPath) && 
            this.config.fileTypes.some(ext => file.toLowerCase().endsWith(ext))
          );
        }
      }
      
      return images;
    } catch (error) {
      console.error("获取图片列表失败:", error);
      return []; // 返回空数组
    }
  }
}

// 自动初始化页面上的所有画廊容器
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM已加载，开始初始化画廊...");
  
  const galleries = document.querySelectorAll('.mkdocs-gallery');
  console.log(`找到 ${galleries.length} 个画廊容器`);
  
  galleries.forEach(container => {
    // 从data属性获取配置
    const options = {
      folderPath: container.dataset.folderPath || "images/team/",
      imageSize: container.dataset.imageSize || "200px",
      gap: container.dataset.gap || "15px"
    };
    
    console.log(`初始化画廊: ${container.id}`, options);
    
    try {
      new MkDocsGallery(container.id, options);
    } catch (error) {
      console.error(`初始化画廊 ${container.id} 失败:`, error);
      container.innerHTML = `<p>画廊初始化失败: ${error.message}</p>`;
    }
  });
});