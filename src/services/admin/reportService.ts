import { FetchReportsResponse, FetchReportsParams, DownloadReportParams } from "../../types/admin/report-management";
import { apiClient } from "../../utils/apiClient";
import { TokenService } from "../tokenService";

export class ReportService {
    static async fetchReports({
        start_date,
        end_date,
        page = 1,
        size = 10
    }: FetchReportsParams): Promise<FetchReportsResponse> {
        try {
            const params = new URLSearchParams({
                start_date,
                end_date,
                page: String(Math.max(0, page - 1)),
                size: String(size)
            });
            const response = await apiClient.get(`/report?${params.toString()}`);
            return {
                error: response.error,
                reports: response.reports || [],
                token: response.token || "",
                message: response.message,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                currentPage: response.currentPage,
                pageSize: response.pageSize,
            };
        } catch (error) {
            console.error("Error fetching reports:", error);
            return {
                error: true,
                reports: [],
                token: "",
                message: error instanceof Error ? error.message : "Unknown error",
                totalPages: 0,
                totalElements: 0,
                currentPage: 0,
                pageSize: 0,
            };
        }
    }

    static async downloadReport({ start_date, end_date }: DownloadReportParams): Promise<Blob | null> {
        try {
            // The apiClient returns JSON, but for file download, we need to fetch the blob directly
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const token = TokenService.getToken();
            const headers: Record<string, string> = {
                "API-KEY": import.meta.env.VITE_API_KEY || "",
                "Content-Type": "application/json",
                "Accept": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            };
            if (token) headers["Authorization"] = `Bearer ${token}`;
            const fetchResponse = await fetch(`${API_BASE_URL}/report/download`, {
                method: "POST",
                headers,
                body: JSON.stringify({ start_date, end_date })
            });
            if (!fetchResponse.ok) throw new Error("Failed to download report");
            const blob = await fetchResponse.blob();
            return blob;
        } catch (error) {
            console.error("Error downloading report:", error);
            return null;
        }
    }
} 