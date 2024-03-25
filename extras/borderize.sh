#!/bin/bash

# Check if the input PDF file is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <input_pdf>"
    exit 1
fi

input_pdf="$1"

if [ ! -f "$input_pdf" ]; then
    echo "Error: File not found: $input_pdf"
    exit 1
fi

output_pdf="cropped.pdf"
output_pdf_2="cropped_2.pdf"

# Temporary file for storing intermediate results
temp_file="temp.pdf"
temp_file_2="temp2.pdf"

# Delete the temporary file if it exists
rm -f "$temp_file"
rm -f "$output_pdf"
rm -f "$output_pdf_2"
rm -f "$temp_file_2"

num_pages=$(pdfinfo "$input_pdf" | grep -i "Pages" | awk '{print $2}')
for page_num in $(seq 1 $num_pages); do
    # Extract the current page so it can be modified one page at a time
    pdftk "$input_pdf" cat "$page_num" output "$temp_file"

    # Left and right pages have different crops for use in binders
    if [ $((page_num % 2)) -eq 1 ]; then
        # Left-hand page
        pdf-crop-margins -o "$temp_file_2" -p 1 -a4 -48.96 -21.42 -18 -21.42 "$temp_file"
    else
        # Right-hand page
        pdf-crop-margins -o "$temp_file_2" -p 1 -a4 -18 -21.42 -48.96 -21.42 "$temp_file"
    fi

    # Need to check if file exists before concat is attempted
    if [ -f "$output_pdf" ]; then
        pdftk "$output_pdf" "$temp_file_2" cat output "$output_pdf_2"
    else
        pdftk "$temp_file_2" cat output "$output_pdf_2"
    fi

    cp "$output_pdf_2" "$output_pdf"
done

# # Clean up the temporary file
rm -f "$temp_file"
rm -f "$output_pdf"
rm -f "$temp_file"
echo "Cropped PDF saved as $output_pdf"
