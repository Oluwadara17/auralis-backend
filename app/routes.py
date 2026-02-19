from flask import Blueprint, request, jsonify
from app import db
from app.models import Journal, ImpactMetric, Testimonial, ContactSubmission, VolunteerSubmission

main = Blueprint('main', __name__)

# ── JOURNALS ──────────────────────────────────────────

@main.route('/api/journals', methods=['GET'])
def get_journals():
    journals = Journal.query.filter_by(is_published=True).all()
    return jsonify([{
        'id': j.id,
        'title': j.title,
        'excerpt': j.excerpt,
        'author': j.author,
        'tags': j.tags,
        'created_at': j.created_at
    } for j in journals])

@main.route('/api/journals/<int:id>', methods=['GET'])
def get_journal(id):
    j = Journal.query.get_or_404(id)
    return jsonify({
        'id': j.id,
        'title': j.title,
        'content': j.content,
        'excerpt': j.excerpt,
        'author': j.author,
        'tags': j.tags,
        'created_at': j.created_at
    })

@main.route('/api/journals', methods=['POST'])
def create_journal():
    data = request.get_json()
    journal = Journal(
        title=data['title'],
        content=data['content'],
        excerpt=data.get('excerpt'),
        author=data.get('author'),
        tags=data.get('tags'),
        is_published=data.get('is_published', True)
    )
    db.session.add(journal)
    db.session.commit()
    return jsonify({'message': 'Journal created successfully'}), 201

@main.route('/api/journals/<int:id>', methods=['PUT'])
def update_journal(id):
    j = Journal.query.get_or_404(id)
    data = request.get_json()
    j.title = data.get('title', j.title)
    j.content = data.get('content', j.content)
    j.excerpt = data.get('excerpt', j.excerpt)
    j.tags = data.get('tags', j.tags)
    j.is_published = data.get('is_published', j.is_published)
    db.session.commit()
    return jsonify({'message': 'Journal updated successfully'})

@main.route('/api/journals/<int:id>', methods=['DELETE'])
def delete_journal(id):
    j = Journal.query.get_or_404(id)
    db.session.delete(j)
    db.session.commit()
    return jsonify({'message': 'Journal deleted successfully'})


# ── IMPACT METRICS ────────────────────────────────────

@main.route('/api/impact', methods=['GET'])
def get_impact():
    metrics = ImpactMetric.query.all()
    return jsonify([{
        'id': m.id,
        'title': m.title,
        'value': m.value,
        'description': m.description
    } for m in metrics])

@main.route('/api/impact', methods=['POST'])
def create_impact():
    data = request.get_json()
    metric = ImpactMetric(
        title=data['title'],
        value=data['value'],
        description=data.get('description')
    )
    db.session.add(metric)
    db.session.commit()
    return jsonify({'message': 'Impact metric created successfully'}), 201


# ── TESTIMONIALS ──────────────────────────────────────

@main.route('/api/testimonials', methods=['GET'])
def get_testimonials():
    testimonials = Testimonial.query.all()
    return jsonify([{
        'id': t.id,
        'name': t.name,
        'role': t.role,
        'message': t.message
    } for t in testimonials])

@main.route('/api/testimonials', methods=['POST'])
def create_testimonial():
    data = request.get_json()
    testimonial = Testimonial(
        name=data['name'],
        role=data.get('role'),
        message=data['message']
    )
    db.session.add(testimonial)
    db.session.commit()
    return jsonify({'message': 'Testimonial created successfully'}), 201


# ── CONTACT ───────────────────────────────────────────

@main.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    submission = ContactSubmission(
        name=data['name'],
        email=data['email'],
        subject=data.get('subject'),
        message=data['message']
    )
    db.session.add(submission)
    db.session.commit()
    return jsonify({'message': 'Message received successfully'}), 201


# ── VOLUNTEER ─────────────────────────────────────────

@main.route('/api/volunteer', methods=['POST'])
def volunteer():
    data = request.get_json()
    submission = VolunteerSubmission(
        name=data['name'],
        email=data['email'],
        interest=data.get('interest'),
        message=data.get('message')
    )
    db.session.add(submission)
    db.session.commit()
    return jsonify({'message': 'Volunteer application received!'}), 201
