import os
import json
from flask import Flask, request, jsonify
import stripe

# Configuration de l'application Solenia
app = Flask(__name__)

# Les clés seraient normalement dans des variables d'environnement
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_solenia_placeholder")

@app.route('/api/process-order', methods=['POST'])
def process_order():
    """
    Traite la commande envoyée depuis le formulaire de checkout.
    Valide les données, crée l'intention de paiement Stripe et enregistre en base.
    """
    try:
        data = request.get_json()
        
        # 1. Validation basique des données
        required_fields = ['email', 'firstname', 'lastname', 'address', 'city', 'zip', 'payment_method_id']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Champ manquant : {field}"}), 400

        # 2. Calcul du montant (côté serveur pour sécurité)
        # Dans un cas réel, on irait chercher les prix dans products.json
        amount = 145000  # 1450.00€ en centimes

        # 3. Création du PaymentIntent Stripe
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='eur',
            payment_method=data['payment_method_id'],
            confirmation_method='manual',
            confirm=True,
            receipt_email=data['email'],
            metadata={
                'order_id': 'SOL-' + os.urandom(4).hex().upper(),
                'customer_name': f"{data['firstname']} {data['lastname']}"
            }
        )

        return handle_payment_response(intent)

    except stripe.error.CardError as e:
        return jsonify({"error": e.user_message}), 402
    except Exception as e:
        return jsonify({"error": "Une erreur interne est survenue. Veuillez réessayer."}), 500

def handle_payment_response(intent):
    """Gère les différents états de la réponse Stripe"""
    if intent.status == 'succeeded':
        # Ici, on déclencherait l'envoi de l'email de confirmation
        # et la mise à jour des stocks
        return jsonify({
            "success": True,
            "order_id": intent.metadata['order_id'],
            "message": "Paiement validé avec succès"
        }), 200
    elif intent.status == 'requires_action':
        return jsonify({
            "requires_action": True,
            "payment_intent_client_secret": intent.client_secret
        }), 200
    else:
        return jsonify({"error": "État de paiement invalide"}), 400

if __name__ == '__main__':
    # Lancement du serveur de développement
    app.run(port=5000, debug=True)
