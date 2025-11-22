module tracking_app::tracking {
    use std::string::{Self, String};
    use std::vector; 
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::package;
    use sui::display;

    // --- DATA UTAMA ---
    struct Paket has key, store {
        id: UID,
        item_name: String,
        created_by: address,
        current_owner: address,
        status: String, 
        location_history: vector<String>, 
    }

    // --- OTW (One-Time-Witness) ---
    // INI SUDAH BENAR: Modul 'tracking' -> Struct 'TRACKING'
    struct TRACKING has drop {} 

    // --- FUNGSI INIT (DISPLAY) ---
    fun init(otw: TRACKING, ctx: &mut TxContext) {
        let keys = vector[
            string::utf8(b"name"),
            string::utf8(b"description"),
            string::utf8(b"image_url"),
            string::utf8(b"creator"),
        ];

        let values = vector[
            string::utf8(b"Paket: {item_name}"),
            string::utf8(b"Status: {status}"),
            // Gambar Kotak Paket Biru
            string::utf8(b"https://cdn-icons-png.flaticon.com/512/4569/4569294.png"), 
            string::utf8(b"Supply Chain System"),
        ];

        let publisher = package::claim(otw, ctx);
        let display = display::new_with_fields<Paket>(&publisher, keys, values, ctx);
        display::update_version(&mut display);
        
        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
    }

    // --- 1. FUNGSI CREATE (PABRIK) ---
    public entry fun create_package(
        item_name: String,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let id = object::new(ctx);
        
        // Kita mulai dengan history kosong
        let history = vector::empty<String>();
        
        let paket = Paket {
            id,
            item_name,
            created_by: sender,
            current_owner: sender,
            status: string::utf8(b"Di Pabrik (Produksi)"),
            location_history: history,
        };

        transfer::transfer(paket, sender);
    }

    // --- 2. FUNGSI UPDATE & TRANSFER (KURIR) ---
    public entry fun update_and_transfer(
        paket: &mut Paket, 
        new_status: String, 
        recipient: address, 
        _ctx: &mut TxContext
    ) {
        let old_status = paket.status;
        vector::push_back(&mut paket.location_history, old_status);

        paket.status = new_status;
        paket.current_owner = recipient;
    }
    
    // FUNGSI TRANSFER MURNI
    public entry fun kirim_paket(
        paket: Paket,
        recipient: address,
        _ctx: &mut TxContext
    ) {
        transfer::transfer(paket, recipient);
    }
}