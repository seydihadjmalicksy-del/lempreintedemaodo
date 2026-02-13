#!/usr/bin/env python3
"""
Script to add watermark to all PDF files in the ouvrages directory
"""
import os
from PyPDF2 import PdfReader, PdfWriter
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.colors import Color
from PIL import Image
import io
import tempfile

OUVRAGES_DIR = "/app/frontend/public/ouvrages"
WATERMARK_IMAGE = "/app/frontend/public/filigrane-maodo.png"
OPACITY = 0.25  # 25% opacity

def create_watermark_pdf(page_width, page_height, watermark_image_path, opacity=0.25):
    """Create a PDF with the watermark image centered"""
    packet = io.BytesIO()
    can = canvas.Canvas(packet, pagesize=(page_width, page_height))
    
    # Load and resize watermark image
    try:
        img = Image.open(watermark_image_path)
        
        # Calculate watermark size (40% of page width)
        wm_width = page_width * 0.4
        aspect_ratio = img.height / img.width
        wm_height = wm_width * aspect_ratio
        
        # Center position
        x = (page_width - wm_width) / 2
        y = (page_height - wm_height) / 2
        
        # Save image to temporary file for reportlab
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
            # Make image semi-transparent
            if img.mode != 'RGBA':
                img = img.convert('RGBA')
            
            # Adjust opacity
            alpha = img.split()[3]
            alpha = alpha.point(lambda p: int(p * opacity))
            img.putalpha(alpha)
            
            img.save(tmp.name, 'PNG')
            tmp_path = tmp.name
        
        # Draw the watermark
        can.drawImage(tmp_path, x, y, width=wm_width, height=wm_height, mask='auto')
        
        # Clean up temp file
        os.unlink(tmp_path)
        
    except Exception as e:
        # Fallback: draw text watermark
        can.setFillColor(Color(0.83, 0.69, 0.22, alpha=opacity))  # Gold color
        can.setFont("Helvetica-Bold", 40)
        can.saveState()
        can.translate(page_width/2, page_height/2)
        can.rotate(45)
        can.drawCentredString(0, 0, "L'empreinte de Maodo")
        can.restoreState()
    
    can.save()
    packet.seek(0)
    return PdfReader(packet)


def add_watermark_to_pdf(input_path, output_path, watermark_image_path, opacity=0.25):
    """Add watermark to all pages of a PDF"""
    try:
        reader = PdfReader(input_path)
        writer = PdfWriter()
        
        for page_num, page in enumerate(reader.pages):
            # Get page dimensions
            page_width = float(page.mediabox.width)
            page_height = float(page.mediabox.height)
            
            # Create watermark for this page size
            watermark_pdf = create_watermark_pdf(page_width, page_height, watermark_image_path, opacity)
            watermark_page = watermark_pdf.pages[0]
            
            # Merge watermark under the content
            page.merge_page(watermark_page, over=False)
            writer.add_page(page)
        
        # Write output
        with open(output_path, 'wb') as output_file:
            writer.write(output_file)
        
        return True
    except Exception as e:
        print(f"  Error: {e}")
        return False


def process_all_pdfs():
    """Process all PDFs in the ouvrages directory"""
    if not os.path.exists(WATERMARK_IMAGE):
        print(f"Error: Watermark image not found at {WATERMARK_IMAGE}")
        return
    
    pdf_files = [f for f in os.listdir(OUVRAGES_DIR) if f.endswith('.pdf')]
    total = len(pdf_files)
    
    print(f"Found {total} PDF files to process")
    print(f"Using watermark: {WATERMARK_IMAGE}")
    print(f"Opacity: {OPACITY * 100}%")
    print("-" * 50)
    
    success_count = 0
    error_count = 0
    
    for i, pdf_file in enumerate(pdf_files, 1):
        input_path = os.path.join(OUVRAGES_DIR, pdf_file)
        
        # Create temporary output path
        temp_output = input_path + '.tmp'
        
        print(f"[{i}/{total}] Processing: {pdf_file}...", end=" ")
        
        if add_watermark_to_pdf(input_path, temp_output, WATERMARK_IMAGE, OPACITY):
            # Replace original with watermarked version
            os.replace(temp_output, input_path)
            print("✓ Done")
            success_count += 1
        else:
            # Remove temp file if it exists
            if os.path.exists(temp_output):
                os.unlink(temp_output)
            print("✗ Failed")
            error_count += 1
    
    print("-" * 50)
    print(f"Complete: {success_count} succeeded, {error_count} failed")


if __name__ == "__main__":
    process_all_pdfs()
