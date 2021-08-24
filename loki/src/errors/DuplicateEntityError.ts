export default class DuplicateEntityError extends Error{
    constructor(message: string) {
        super(message);
        this.name = 'DuplicateEntityError';
    }
}
