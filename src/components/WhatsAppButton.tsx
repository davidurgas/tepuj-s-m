import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = '421903123456'; // Replace with actual phone number
  const message = 'Dobrý deň, mám záujem o prenájom tepovacieho stroja.';
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20BA5C] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
      aria-label="Kontaktujte nás cez WhatsApp"
    >
      <MessageCircle className="w-7 h-7" fill="white" />
      
      {/* Tooltip */}
      <span className="absolute right-16 bg-sapphire-DEFAULT text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md">
        Napíšte nám na WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton;
