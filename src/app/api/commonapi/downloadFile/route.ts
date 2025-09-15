import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { bulkUploadTypeEmployee, bulkUploadTypeHolidays } from '@/app/pro_utils/stringConstants';

export async function POST(request: NextRequest) {
    let filePath: string = "";
    let fileName: string = "";
    let contentType: string = "";

    try {
        // Parse form data
        const formData = await request.formData();
        const fileType = formData.get('file_type');
        const data_type = formData.get('data_type');

        // Determine file path, name, and content type based on file type
        if (fileType === "csv") {
            console.log("=============================",data_type===bulkUploadTypeEmployee);
            
            if(data_type===bulkUploadTypeEmployee){
            filePath = path.join(process.cwd(), 'sampleFiles/', 'emp_sample.csv');
            fileName = "emp_sample.csv";
            contentType = "text/csv";
            }else if(data_type===bulkUploadTypeHolidays){
                filePath = path.join(process.cwd(), 'sampleFiles/', 'holidaysBulk.csv');
                fileName = "holidaysBulk.csv";
                contentType = "text/csv";
            }
        } else {
            if(data_type===bulkUploadTypeEmployee){
                filePath = path.join(process.cwd(), 'sampleFiles/', 'employees.xlsx');
                fileName = "employees.xlsx";
                contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            }else if(data_type===bulkUploadTypeHolidays){
                filePath = path.join(process.cwd(), 'sampleFiles/', 'holidaysBulk.xlsx');
                fileName = "holidaysBulk.xlsx";
                contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            }
        }

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return new Response(JSON.stringify({ message: 'File not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Create a readable stream from the file
        const fileStream = fs.createReadStream(filePath);

        // Create a response with the file stream
        const response = new Response(fileStream as any, {
            status: 200,
            headers: {
                'Content-Disposition': `attachment; filename="${fileName}"`,
                'Content-Type': contentType,
            },
        });

        return response;
    } catch (error) {
        console.error('Error reading file:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}