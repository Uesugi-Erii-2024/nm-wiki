# generate_file_list.py
import os
import json

def generate_file_list():
    # 获取docs目录下的所有文件
    all_files = []
    for root, dirs, files in os.walk("docs"):
        for file in files:
            # 转换为相对路径（相对于docs目录）
            rel_path = os.path.relpath(os.path.join(root, file), "docs")
            # 将路径分隔符转换为URL格式（正斜杠）
            rel_path = rel_path.replace("\\", "/")
            # 确保路径不以斜杠开头
            if rel_path.startswith('/'):
                rel_path = rel_path[1:]
            all_files.append(rel_path)
    
    # 保存为JSON文件
    with open("docs/file-list.json", "w", encoding="utf-8") as f:
        json.dump(all_files, f, ensure_ascii=False, indent=2)
    
    print(f"生成文件列表完成，共 {len(all_files)} 个文件")

if __name__ == "__main__":
    generate_file_list()