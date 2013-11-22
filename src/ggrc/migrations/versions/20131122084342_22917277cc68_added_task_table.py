
"""Added Task table

Revision ID: 22917277cc68
Revises: 22ed1c0cd379
Create Date: 2013-11-22 08:43:42.962760

"""

# revision identifiers, used by Alembic.
revision = '22917277cc68'
down_revision = '22ed1c0cd379'

from alembic import op
import sqlalchemy as sa
from ggrc.models.types import JsonType
from sqlalchemy.dialects import mysql

def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('tasks',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=250), nullable=True),
    sa.Column('parameters', JsonType(), nullable=True),
    sa.Column('result', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('modified_by_id', sa.Integer(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('context_id', sa.Integer(), nullable=True),
    sa.Column('status', sa.String(length=250), nullable=True),
    sa.ForeignKeyConstraint(['context_id'], ['contexts.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('tasks')
    ### end Alembic commands ###
