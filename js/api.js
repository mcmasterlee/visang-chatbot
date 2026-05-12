// ===== RESTful Table API 통신 모듈 =====

const API = {
    baseURL: 'tables',

    // GET: 목록 조회
    async list(tableName, params = {}) {
        const query = new URLSearchParams(params).toString();
        const url = `${this.baseURL}/${tableName}${query ? '?' + query : ''}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`API.list(${tableName}) error:`, error);
            throw error;
        }
    },

    // GET: 단일 레코드 조회
    async get(tableName, recordId) {
        try {
            const response = await fetch(`${this.baseURL}/${tableName}/${recordId}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`API.get(${tableName}, ${recordId}) error:`, error);
            throw error;
        }
    },

    // POST: 레코드 생성
    async create(tableName, data) {
        try {
            const response = await fetch(`${this.baseURL}/${tableName}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`API.create(${tableName}) error:`, error);
            throw error;
        }
    },

    // PUT: 레코드 전체 업데이트
    async update(tableName, recordId, data) {
        try {
            const response = await fetch(`${this.baseURL}/${tableName}/${recordId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`API.update(${tableName}, ${recordId}) error:`, error);
            throw error;
        }
    },

    // PATCH: 레코드 부분 업데이트
    async patch(tableName, recordId, data) {
        try {
            const response = await fetch(`${this.baseURL}/${tableName}/${recordId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`API.patch(${tableName}, ${recordId}) error:`, error);
            throw error;
        }
    },

    // DELETE: 레코드 삭제
    async delete(tableName, recordId) {
        try {
            const response = await fetch(`${this.baseURL}/${tableName}/${recordId}`, {
                method: 'DELETE'
            });
            if (!response.ok && response.status !== 204) {
                throw new Error(`HTTP ${response.status}`);
            }
            return true;
        } catch (error) {
            console.error(`API.delete(${tableName}, ${recordId}) error:`, error);
            throw error;
        }
    },

    // 검색
    async search(tableName, searchQuery, limit = 100) {
        return this.list(tableName, { search: searchQuery, limit });
    }
};
