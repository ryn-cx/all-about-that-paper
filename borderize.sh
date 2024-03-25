#!/bin/bash

# # Check if the input PDF file is provided
# if [ -z "$1" ]; then
#     echo "Usage: $0 <input_pdf>"
#     exit 1
# fi

input_pdf="4_pages.pdf"
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


# Iterate over each page of the PDF
page_num=1
while true; do
    echo $page_num
    # Extract the current page to a temporary file
    pdftk "$input_pdf" cat "$page_num" output "$temp_file"

    # Check if the extraction was successful (i.e., if the page exists)
    if [ $? -ne 0 ]; then
        break
    fi

    # Determine the crop margins based on the page number
    if [ $((page_num % 2)) -eq 1 ]; then
        # Left-hand page
        pdf-crop-margins -o "$temp_file_2" -p 1 -a4 -48.96 -21.42 -18 -21.42 "$temp_file"
    else
        # Right-hand page
        pdf-crop-margins -o "$temp_file_2" -p 1 -a4 -18 -21.42 -48.96 -21.42 "$temp_file"
    fi

    # Check if output_pdf exists
    if [ -f "$output_pdf" ]; then
        pdftk "$output_pdf" "$temp_file_2" cat output "$output_pdf_2"
    else
        pdftk "$temp_file_2" cat output "$output_pdf_2"
    fi

    cp "$output_pdf_2" "$output_pdf"

    # Move to the next page
    page_num=$((page_num + 1))
done

# # Clean up the temporary file
# rm -f "$temp_file"
rm -f "$temp_file"
rm -f "$output_pdf"
rm -f "$temp_file_2"
echo "Cropped PDF saved as $output_pdf"