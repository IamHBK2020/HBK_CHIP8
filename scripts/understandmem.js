class CPU {
    constructor() {
        // Create a shared 8-byte ArrayBuffer
        let buffer = new ArrayBuffer(8); 

        // Two different "views" into the same memory
        this.reg8 = new Uint8Array(buffer);   // For 8-bit register access
        this.reg16 = new Uint16Array(buffer); // For 16-bit register access

        // Map register names to indexes
        this.L = 0;  // reg8[0]
        this.H = 1;  // reg8[1]
        this.E = 2;  // reg8[2]
        this.D = 3;  // reg8[3]
        this.C = 4;  // reg8[4]
        this.B = 5;  // reg8[5]
        this.A = 6;  // reg8[6]
        this.F = 7;  // reg8[7] (flag register maybe)

        // (Optional) Clear all registers initially
        this.reset();
    }

    // Reset all registers to 0
    reset() {
        this.reg8.fill(0);
    }

    // Get 16-bit HL register pair
    getHL() {
        return this.reg16[0]; // 0th 16-bit word (H:L)
    }

    // Set 16-bit HL register pair
    setHL(value) {
        this.reg16[0] = value;
    }

    // Get 16-bit DE register pair
    getDE() {
        return this.reg16[1]; // 1st 16-bit word (D:E)
    }

    // Set 16-bit DE register pair
    setDE(value) {
        this.reg16[1] = value;
    }

    // (You could add BC and AF too similarly if needed)
}

// Usage example:

let cpu = new CPU();

// Set H and L manually
cpu.reg8[cpu.H] = 0x12;  // H = 0x12
cpu.reg8[cpu.L] = 0x34;  // L = 0x34

console.log(cpu.getHL().toString(16)); 
// prints: "1234" ✅

// Set HL directly
cpu.setHL(0xABCD);

console.log(cpu.reg8[cpu.H].toString(16)); 
// prints: "ab" (high byte)

console.log(cpu.reg8[cpu.L].toString(16)); 
// prints: "cd" (low byte)

