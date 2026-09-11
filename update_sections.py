import re

files = ['about.html', 'blog.html']

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
    except FileNotFoundError:
        continue
    
    # We will find all <section ...> tags, count them, and apply bg-grad-X and section-pad
    # But wait, if they have 'content-container' in the section class, we need to extract it
    # and wrap the contents.
    
    sections = re.finditer(r'(?i)(<section[^>]*>)(.*?)(</section>)', content, flags=re.DOTALL)
    
    new_content = ""
    last_idx = 0
    bg_idx = 1
    
    for match in sections:
        new_content += content[last_idx:match.start()]
        
        section_tag = match.group(1)
        inner = match.group(2)
        close_tag = match.group(3)
        
        # Determine if it has content-container
        needs_container = False
        if 'content-container' in section_tag:
            needs_container = True
            
        # Also check for flex, text-center, etc., on the section tag itself that should go to the inner container
        class_match = re.search(r'class="([^"]*)"', section_tag)
        inner_classes = []
        if class_match:
            classes = class_match.group(1).split()
            for c in classes:
                if c not in ['section-padding', 'pt-8', 'lg:pt-6', 'relative', 'mb-6', 'border-t', 'border-white/5'] and not c.startswith('bg-'):
                    inner_classes.append(c)
        
        inner_class_str = " ".join(inner_classes)
        if 'content-container' not in inner_class_str and needs_container:
            inner_class_str += " content-container mx-auto"
            
        # Reconstruct the section
        # Use bg-grad-X (cycling 1 to 5)
        grad_class = f"bg-grad-{bg_idx}"
        bg_idx = bg_idx + 1 if bg_idx < 5 else 1
        
        # Keep id if exists
        id_match = re.search(r'id="([^"]*)"', section_tag)
        id_str = f'id="{id_match.group(1)}"' if id_match else ''
        
        new_section_tag = f'<section {id_str} class="section-pad {grad_class} w-full relative">'
        
        if len(inner_class_str.strip()) > 0:
            new_inner = f'<div class="{inner_class_str.strip()}">{inner}</div>'
        else:
            new_inner = inner
            
        new_content += new_section_tag + new_inner + close_tag
        last_idx = match.end()
        
    new_content += content[last_idx:]
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(new_content)

print("Done")
