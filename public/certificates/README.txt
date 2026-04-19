Place certificate PDF files in this folder.

Expected filenames currently referenced by the site:
- aws-cloud-foundations.pdf
- aws-cloud-developing.pdf
- aws-cloud-quest.pdf

How links work:
- Any file in public/ is served from the site root.
- Example: public/certificates/aws-cloud-foundations.pdf -> /certificates/aws-cloud-foundations.pdf

To add more certificate PDFs:
1) Copy the PDF into this folder.
2) Add or update the matching certificate entry in data/career.json with:
   "pdfUrl": "/certificates/your-file-name.pdf"
3) (Optional) Add a verification URL with:
   "credentialUrl": "https://..."
